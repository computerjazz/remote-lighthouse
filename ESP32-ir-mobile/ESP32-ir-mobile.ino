#include <WiFiClient.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <IRremote.h>
#include <WiFiManager.h>
#include <WiFi.h>
#include <ESP.h>


WebServer server(80);

//IR init
int RECV_PIN = 19;
String lastIRCodeReceived = "";

int RED_PIN = 21;
int GREEN_PIN = 22;
int BLUE_PIN = 23;

boolean recording = false;
boolean redBlinkState = HIGH;
int redBlinkRate = 750;
unsigned long milliCounter = 0;

IRrecv irrecv(RECV_PIN);
IRsend irsend;
decode_results results;

void setup() {
  Serial.begin(115200);

  //Local intialization. Once its business is done, there is no need to keep it around
  WiFiManager wifiManager;
  //reset saved settings
  //wifiManager.resetSettings();
  
  wifiManager.autoConnect("RemoteLighthouse");

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
  
  server.on("/rec", startRecord);
  server.on("/stop", stopRecord);
  server.on("/check", checkIRCode);
  server.on("/clear", clearState);
  server.on("/send", sendCode);
  server.on("/test", test);
  server.on("/marco", sayPolo);
  server.on("/forget", forgetNetwork);


  server.begin();
  Serial.println("Server listening");
  irrecv.enableIRIn(); // Start the receiver
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  digitalWrite(RED_PIN, HIGH);
  digitalWrite(GREEN_PIN, HIGH);
  digitalWrite(BLUE_PIN, HIGH);
}

void loop() {
  server.handleClient();
  processIR();
  blinkCheck();
}

void startRecord() {
  recording = true;
  server.send(200, "application/json", "{\"message\": \"starting record mode...\"}");
}

void stopRecord() {
  recording = false;
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

// esxpects query string of `?type=PEM&value=1234ABC&length=32`
void sendCode() {
  String message = "";
  for (int i = 0; i < server.args(); i++) {
    message += server.argName(i) + ":" + server.arg(i) + ",";
  }

  Serial.println("Sending " + message);

  String irCodeType = getValueOfQueryParam("type:", message);
  Serial.println("Code type:" + irCodeType);

  String irCodeValStr  = getValueOfQueryParam("value:", message);
  Serial.println("code value:" + irCodeValStr);
  unsigned long irCodeValue = strtoul(irCodeValStr.c_str(), NULL, 16);

  String irCodeLengthStr = getValueOfQueryParam("length:", message);
  Serial.println("code length: " + irCodeLengthStr);
  int irCodeLength = irCodeLengthStr.toInt();

  transmitCode(irCodeType, irCodeValue, irCodeLength);

  server.send(200, "text/plain", "sending IR code " + message + "...");
}

String getValueOfQueryParam(String key, String s) {
  int beginIndex = s.indexOf(key) + key.length();
  int endIndex = s.indexOf(",", beginIndex);
  return s.substring(beginIndex, endIndex);
 }

void test() {
  String message = "";
  for (int i = 0; i < server.args(); i++) {
    message += server.argName(i) + ":" + server.arg(i) + ",";
  }
  server.send(200, "application/json", "{\"args\":" + message + ", \"ircode\":" + lastIRCodeReceived + "}");
}

void sayPolo() {
  server.send(200, "application/json", "{\"message\":\"polo\"}");
}

void forgetNetwork() {
  server.send(200, "application/json", "{\"message\":\"disconnecting\"}");
}

