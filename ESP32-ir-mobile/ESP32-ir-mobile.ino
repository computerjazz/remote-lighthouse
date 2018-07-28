#include <WiFiClient.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <IRremote.h>
#include <WiFiManager.h>
#include <WiFi.h>
#include <ESP.h>
#include <ESPmDNS.h>

String VERSION = "1.2";

WebServer server(80);

//IR init
// SEND_PIN = 14 // configured in boarddefs.h
int RECV_PIN = 33;
int PORTAL_MODE_PIN = 32;

int RED_PIN = 25;
int GREEN_PIN = 26;
int BLUE_PIN = 27;
int BUILTIN_LED_PIN = 2;

boolean recording = false;
boolean testing = false;
boolean redBlinkState = HIGH;
int redBlinkRate = 750;
unsigned long milliCounter = 0;
String lastIRCodeReceived = "";
const char RAW_DELIMITER = '-';


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
//    Serial.println("Starting in portal mode");
    wifiManager.startConfigPortal("RemoteLighthouse");
    
  } else {
    wifiManager.autoConnect("RemoteLighthouse");
  }

  if (enteredConfig) {    
    // fixes bug where starting in config mode will connect to wifi
    // but not actually be functional until hard reset
    ESP.restart();
  }
  

//  Serial.print("IP address: ");
//  Serial.println(WiFi.localIP());
//  Serial.print("SSID: ");
//  Serial.println(WiFi.SSID());

//  Serial.println("Setting up mDNS");
  String mac = String(WiFi.macAddress());
  String mDnsString = String("remotelighthouse-" + mac.substring(mac.length() / 2));
  mDnsString.replace(":", "");
//  Serial.println(mDnsString);
  char mDnsChar[mDnsString.length()];
  mDnsString.toCharArray(mDnsChar, mDnsString.length());
  if (!MDNS.begin(mDnsChar)) {
    Serial.println("Error setting up MDNS responder!");
    while(1) {
        delay(1000);
    }
  }

  MDNS.setInstanceName("Remote Lighthouse - " + WiFi.macAddress());
  MDNS.addService("_http", "_tcp", 80);
  MDNS.addServiceTxt("_http", "_tcp", "app", "remotelighthouse");
  
//  Serial.println("mDNS responder started");

//  Serial.println("setting up server");
  server.on("/rec", startRecord);
  server.on("/stop", stopRecord);
  server.on("/check", checkIRCode);
  server.on("/clear", clearState);
  server.on("/send", sendCode);
  server.on("/test", test);
  server.on("/testStop", testStop);
  server.on("/marco", sayPolo);
  server.on("/version", getVersion);


  server.begin();
//  Serial.println("Server listening");
  irrecv.enableIRIn(); // Start the receiver
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  pinMode(BUILTIN_LED_PIN, OUTPUT);
  digitalWrite(RED_PIN, HIGH);
  digitalWrite(GREEN_PIN, HIGH);
  digitalWrite(BLUE_PIN, HIGH);
  digitalWrite(BUILTIN_LED_PIN, LOW);

 blockingBlink(false, false, true, 100, 100, 2);
}

void blockingBlink(boolean r, boolean g, boolean b, int onTime, int offTime, int numBlinks) {
  for (int i = 0; i < numBlinks; i++) {
      if (r) { digitalWrite(RED_PIN, LOW); }
      if (g) { digitalWrite(GREEN_PIN, LOW); }
      if (b) { digitalWrite(BLUE_PIN, LOW); }
      digitalWrite(BUILTIN_LED_PIN, HIGH);
      delay(onTime);
      if (r) { digitalWrite(RED_PIN, HIGH); }
      if (g) { digitalWrite(GREEN_PIN, HIGH); }
      if (b) { digitalWrite(BLUE_PIN, HIGH); }
      digitalWrite(BUILTIN_LED_PIN, LOW);
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

// esxpects query string of `?type=PEM&value=1234ABC&length=32&blink=1`
void sendCode() {
  int shouldBlink = 0;
  String message = "";
  for (int i = 0; i < server.args(); i++) {
    message += server.argName(i) + ":" + server.arg(i) + ",";
    if (server.argName(i) == "blink" && server.arg(i) == "1") {
      shouldBlink = 1; 
    }
  }

//  Serial.println("Sending " + message);

  String irCodeType = getValueOfQueryParam("type:", message);
  
  bool isRaw = irCodeType == "UNKNOWN";
  String irCodeValStr  = getValueOfQueryParam("value:", message);
//  Serial.println("code value:" + irCodeValStr);
  unsigned long irCodeValue = strtoul(irCodeValStr.c_str(), NULL, 16);

  String irCodeLengthStr = getValueOfQueryParam("length:", message);
//  Serial.println("code length: " + irCodeLengthStr);
  int irCodeLength = irCodeLengthStr.toInt();
  if (isRaw) {
    transmitRawCode(irCodeValStr, irCodeLength);
  } else {
    transmitCode(irCodeType, irCodeValue, irCodeLength, shouldBlink);
  }
 
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

void getVersion() {
  server.send(200, "application/json", "{\"version\":" + VERSION + "}");
 }

void sayPolo() {
  int shouldBlink = 0;
  for (int i = 0; i < server.args(); i++) {
    if (server.argName(i) == "blink" && server.arg(i) == "1") {
        shouldBlink = 1; 
     }
  }
  
  server.send(200, "application/json", "{\"message\":\"polo\"}");

  if (shouldBlink == 1) {
    blockingBlink(true, false, false, 100, 0, 1);
    blockingBlink(true, true, false, 100, 0, 1);
    blockingBlink(false, true, false, 100, 0, 1);
    blockingBlink(false, true, true, 100, 0, 1);
    blockingBlink(false, false, true, 100, 0, 1);
    blockingBlink(true, false, true, 100, 0, 1);
   }

}

