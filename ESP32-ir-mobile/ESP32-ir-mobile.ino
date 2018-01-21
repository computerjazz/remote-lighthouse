#include <WiFiClient.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <IRremote.h>
#include <WiFiManager.h>
#include <WiFi.h>
#include <ESP.h>


WebServer server(80);

//IR init
// SEND_PIN = 14 // configured in boarddefs.h
int RECV_PIN = 33;
int PORTAL_MODE_PIN = 32;

int RED_PIN = 25;
int GREEN_PIN = 26;
int BLUE_PIN = 27;

boolean recording = false;
boolean testing = false;
boolean redBlinkState = HIGH;
int redBlinkRate = 750;
unsigned long milliCounter = 0;
String lastIRCodeReceived = "";


IRrecv irrecv(RECV_PIN);
IRsend irsend;
decode_results results;

boolean enteredConfig = false;

void setup() {
  Serial.begin(115200);
  pinMode(PORTAL_MODE_PIN, INPUT);

  //Local intialization. Once its business is done, there is no need to keep it around
  WiFiManager wifiManager;
  //reset saved settings
  //wifiManager.resetSettings();
  wifiManager.setAPCallback(configModeCallback);

  // Start in wifi portal mode if button is pressed
  if (digitalRead(PORTAL_MODE_PIN) == HIGH) {
    Serial.println("Starting in portal mode");
    wifiManager.startConfigPortal("RemoteLighthouse");
    
  } else {
    wifiManager.autoConnect("RemoteLighthouse");
  }

  if (enteredConfig) {    
    // fixes bug where starting in config mode will connect to wifi
    // but not actually be functional until hard reset
    ESP.restart();
  }
  

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  Serial.println("setting up server");
  server.on("/rec", startRecord);
  server.on("/stop", stopRecord);
  server.on("/check", checkIRCode);
  server.on("/clear", clearState);
  server.on("/send", sendCode);
  server.on("/test", test);
  server.on("/testStop", testStop);
  server.on("/marco", sayPolo);

  server.begin();
  Serial.println("Server listening");
  irrecv.enableIRIn(); // Start the receiver
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  digitalWrite(RED_PIN, HIGH);
  digitalWrite(GREEN_PIN, HIGH);
  digitalWrite(BLUE_PIN, HIGH);

 blockingBlink(false, false, true, 100, 100, 2);
}

void blockingBlink(boolean r, boolean g, boolean b, int onTime, int offTime, int numBlinks) {
  for (int i = 0; i < numBlinks; i++) {
      if (r) { digitalWrite(RED_PIN, LOW); }
      if (g) { digitalWrite(GREEN_PIN, LOW); }
      if (b) { digitalWrite(BLUE_PIN, LOW); }
      delay(onTime);
      if (r) { digitalWrite(RED_PIN, HIGH); }
      if (g) { digitalWrite(GREEN_PIN, HIGH); }
      if (b) { digitalWrite(BLUE_PIN, HIGH); }
      delay(offTime);
  }
}

void loop() {
  server.handleClient();
  processIR();
  blinkCheck();
}

void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  enteredConfig = true;
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
  testing = true;
  String message = testing ? "true" : "false";
  server.send(200, "application/json", "{\"testing\":" + message + "}");
}

void testStop() {
  testing = false;
  String message = testing ? "true" : "false";
  server.send(200, "application/json", "{\"testing\":" + message + "}");
}

void sayPolo() {
  server.send(200, "application/json", "{\"message\":\"polo\"}");
  if (testing) {
    blockingBlink(true, false, false, 100, 0, 1);
    blockingBlink(true, true, false, 100, 0, 1);
    blockingBlink(false, true, false, 100, 0, 1);
    blockingBlink(false, true, true, 100, 0, 1);
    blockingBlink(false, false, true, 100, 0, 1);
    blockingBlink(true, false, true, 100, 0, 1);
   }

}

