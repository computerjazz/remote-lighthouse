#include <ESP8266WiFi.h>            
#include <ESP8266WebServer.h>

ESP8266WebServer server(80);   //Web server object. Will be listening in port 80 (default for HTTP)

String lastIRCodeRead = "";
const byte numChars = 32;
char receivedChars[numChars]; // an array to store the received data
boolean newData = false;

void setup() {
  Serial.begin(115200);
  WiFi.begin("2MuchFun", "burgerbelly"); //Connect to the WiFi network
  
  while (WiFi.status() != WL_CONNECTED) { //Wait for connection
    delay(500);
    Serial.println("Waiting to connect…");
  }

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());  //Print the local IP to access the server
  
  server.on("/ir", handleArgs); //Associate the handler function to the path
  
  server.begin();                                       //Start the server
  Serial.println("Server listening");   
}

void loop() {
  server.handleClient();    //Handling of incoming requests
  readSerialData();
}

void handleArgs() { //Handler
  String message = "";
  for (int i = 0; i < server.args(); i++) {
    message += server.argName(i) + ":" + server.arg(i) + ",";
  }
   
  Serial.println(message);
  
  newData = false;
  server.send(200, "text/plain", message + "lastCodeRead: " + lastIRCodeRead);
}

void readSerialData() {
 static byte index = 0;
 char endMarker = '\n';
 char rc;
 
 while (Serial.available() > 0 && newData == false) {
   rc = Serial.read();
  
   if (rc != endMarker) {
     receivedChars[index] = rc;
     index++;
       if (index >= numChars) {
         index = numChars - 1;
       }
   } else {
      newData = true;
      receivedChars[index] = '\0'; // terminate the string
      index = 0;
      String payload = String(receivedChars);
      payload.trim();
      if ((payload.indexOf("Received") >= 0) && (payload.indexOf("repeat") == -1)) {
        lastIRCodeRead = payload;
      } else {
        newData = false;
      }
      
    }
  }
}
