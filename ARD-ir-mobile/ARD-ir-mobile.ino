#include <IRremote.h>

int STATUS_PIN = 13;
int RECV_PIN = 11;

String START_REC = "startRecord";
String STOP_REC = "stopRecord";

String SEND = "send::";
String RCVD = "rcvd::";

// Query string key constants
String TYPE = "type:"; 
String VAL = "val:";
String LEN = "len:";

boolean recording = false;

IRrecv irrecv(RECV_PIN);
IRsend irsend;
decode_results results;

const byte numChars = 64;
char receivedChars[numChars]; // an array to store the received data
boolean newData = false;



void setup() {
  Serial.begin(115200);
  irrecv.enableIRIn(); // Start the receiver
  pinMode(STATUS_PIN, OUTPUT);
}

void loop() {
 readSerialData();
 processSerialData();
 processIR();
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
   }
     else {
       receivedChars[index] = '\0'; // terminate the string
       index = 0;
       newData = true;
     }
   }
}


void processSerialData() {
 if (newData == true) {
   newData = false;
   String payload = String(receivedChars);
   payload.trim();
   if (payload == START_REC) {
    recording = true;
   } else if (payload == STOP_REC) {
    recording = false;
   } else if (payload.indexOf(SEND) >= 0) {

      int beginIRTypeIndex = payload.indexOf(TYPE) + TYPE.length();
      int endIRTypeIndex = payload.indexOf(",", beginIRTypeIndex);

      int beginIRCodeValueIndex = payload.indexOf(VAL) + VAL.length();
      int endIRCodeValueIndex = payload.indexOf(",", beginIRCodeValueIndex);

      int beginLengthIndex = payload.indexOf(LEN) + LEN.length();
      int endLengthIndex = payload.indexOf(",", beginLengthIndex);

      String irCodeLengthStr = payload.substring(beginLengthIndex, endLengthIndex);
      int irCodeLength = irCodeLengthStr.toInt();
      String irCodeType  = payload.substring(beginIRTypeIndex, endIRTypeIndex);
      String irCodeValStr  = payload.substring(beginIRCodeValueIndex, endIRCodeValueIndex);
 
      unsigned long irCodeValue = strtoul(irCodeValStr.c_str(), NULL, 16);
      sendCode(irCodeType, irCodeValue, irCodeLength);
    }
  }
}

// && results.value != UNKNOWN && results.value != REPEAT
void processIR() {
  if (irrecv.decode(&results)) {
    digitalWrite(STATUS_PIN, HIGH);
    if (recording) {
      storeCode(&results);
      recording = false;
     }
    irrecv.resume(); // resume receiver
    digitalWrite(STATUS_PIN, LOW);
  }
}


// Storage for the recorded code
int codeType = -1; // The type of code
unsigned long codeValue; 
int codeLen; // The length of the code
int toggle = 0; // The RC5/6 toggle state

void storeCode(decode_results *results) {
  codeType = results->decode_type;
  int count = results->rawlen;

   switch(codeType) {
      case NEC:     
        if (results->value == REPEAT) {
          return;
        }
        Serial.print(RCVD + "\"type\":\"NEC\"");
        break;
      case SONY:
        Serial.print(RCVD + "\"type\":\"SONY\"");
        break;
      case PANASONIC:
        Serial.print(RCVD + "\"type\":\"PANASONIC\"");
        break;
      case JVC:
        Serial.print(RCVD + "\"type\":\"JVC\"");
        break;
      case RC5:
        Serial.print(RCVD + "\"type\":\"RC5\"");
        break;
      case RC6:
        Serial.print(RCVD + "\"type\":\"RC6\"");
        break;
      default:
        return;
    }
    
    codeValue = results->value;
    codeLen = results->bits;
    Serial.print(",\"length\":");
    Serial.print(codeLen);
    Serial.print(",\"value\":\"");
    Serial.print(codeValue, HEX);
    Serial.print("\"");
    Serial.println();
}

void sendCode(String codeType, unsigned long codeValue, int codeLen) {
  if (codeType == "NEC") {
    irsend.sendNEC(codeValue, codeLen);
    Serial.print("Sent NEC:");
    Serial.println(codeValue, HEX);
  } else if (codeType == "SONY") {
    irsend.sendSony(codeValue, codeLen);
    Serial.print("Sent Sony:");
    Serial.println(codeValue, HEX);
  } else if (codeType == "PANASONIC") {
    irsend.sendPanasonic(codeValue, codeLen);
    Serial.print("Sent Panasonic");
    Serial.println(codeValue, HEX);
  } else if (codeType == "JVC") {
    irsend.sendPanasonic(codeValue, codeLen);
    Serial.print("Sent JVC");
    Serial.println(codeValue, HEX);
  } else if (codeType == "RC5" || codeType == "RC6") {
    toggle = 1 - toggle;

    // Put the toggle bit into the code to send
    codeValue = codeValue & ~(1 << (codeLen - 1));
    codeValue = codeValue | (toggle << (codeLen - 1));
    if (codeType == "RC5") {
      Serial.print("Sent RC5 ");
      Serial.println(codeValue, HEX);
      irsend.sendRC5(codeValue, codeLen);
    } 
    else {
      irsend.sendRC6(codeValue, codeLen);
      Serial.print("Sent RC6 ");
      Serial.println(codeValue, HEX);
    }
  }
  irrecv.enableIRIn(); // Re-enable receiver
}




