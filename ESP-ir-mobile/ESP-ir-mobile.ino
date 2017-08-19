#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

String START_REC = "startRecord";
String STOP_REC = "stopRecord";
String RCVD = "rcvd::";

// Web server object. Will be listening in port 80 (default for HTTP)
ESP8266WebServer server(80);

String lastIRCodeReceived = "";
const byte numChars = 64;
char receivedChars[numChars];
boolean serialEndReached = false;

void setup() {
  Serial.begin(115200);
  WiFi.begin("2MuchFun", "burgerbelly"); //Connect to the WiFi network

  while (WiFi.status() != WL_CONNECTED) { //Wait for connection
    delay(500);
    Serial.println("Waiting to connect…");
  }

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/rec", beginRecord);
  server.on("/stop", endRecord);
  server.on("/check", checkIRCode);
  server.on("/clear", clearState);
  server.on("/send", sendIRCode);
  server.on("/test", test);


  server.begin();
  Serial.println("Server listening");
}

void loop() {
  server.handleClient();
  readSerialData();
}

void beginRecord() {
  Serial.println(START_REC);
  server.send(200, "application/json", "{\"message\": \"starting record mode...\"}");
}

void endRecord() {
  Serial.println(STOP_REC);
  server.send(200, "application/json", "{\"message\": \"stopping record mode...\"}");
}

void checkIRCode() {
  server.send(200, "application/json", "{" + lastIRCodeReceived + "}");
  lastIRCodeReceived = "";
}

void clearState() {
  lastIRCodeReceived = "";
  server.send(200, "application/json", "{\"message\": \"state cleared.\"}");
}

// esxpects query string of `?type=PEM&val=1234ABC&len=32`
void sendIRCode() {
  String message = "";
  for (int i = 0; i < server.args(); i++) {
    message += server.argName(i) + ":" + server.arg(i) + ",";
  }
  Serial.println("send::" + message);
  server.send(200, "text/plain", "sending IR code " + message + "...");
}

void test() {
  String message = "";
  for (int i = 0; i < server.args(); i++) {
    message += server.argName(i) + ":" + server.arg(i) + ",";
  }
  server.send(200, "application/json", "{\"args\":" + message + ", \"ircode\":" + lastIRCodeReceived + "}");
}

void readSerialData() {
 static byte index = 0;
 char endMarker = '\n';
 char rc;

 while (Serial.available() > 0 && serialEndReached == false) {
   rc = Serial.read();

   if (rc != endMarker) {
     receivedChars[index] = rc;
     index++;
       if (index >= numChars) {
         index = numChars - 1;
       }
   } else {
      serialEndReached = true;
      receivedChars[index] = '\0'; // terminate the string
      index = 0;
      String payload = String(receivedChars);
      payload.trim();
      if ((payload.indexOf(RCVD) >= 0) && (payload.indexOf("repeat") == -1)) {
        lastIRCodeReceived = payload.substring(RCVD.length());
        serialEndReached = false;
      } else {
        serialEndReached = false;
      }
    }
  }
}
