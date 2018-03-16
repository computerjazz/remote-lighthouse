void blinkCheck() {
   if (recording) {
    if (millis() > milliCounter) {
       redBlinkState = !redBlinkState;
       milliCounter += redBlinkRate;
      }
    if (redBlinkState) digitalWrite(RED_PIN, LOW);
    else digitalWrite(RED_PIN, HIGH);

  } else {
    digitalWrite(RED_PIN, HIGH);
  }
}

void processIR() {
  if (irrecv.decode(&results)) {
    if (recording) {
      boolean successful = storeCode(&results);
      if (successful) {
        recording = false;
        digitalWrite(RED_PIN, HIGH);
        blockingBlink(false, true, false, 250, 0, 1);
      }
     }
    irrecv.resume(); // resume receiver
  }
}


// Storage for the recorded code
int codeType = -1; // The type of code
unsigned long codeValue;
int codeLen; // The length of the code
int toggle = 0; // The RC5/6 toggle state

boolean storeCode(decode_results *results) {
  Serial.println("storing code!");
  codeType = results->decode_type;
  int count = results->rawlen;
   // TODO: add LED green blink feedback on successful storage of supported code
   String codeData = "";
   
   switch(codeType) {
      case NEC:
        if (results->value == REPEAT) {
          return false;
        }
        codeData += "\"type\":\"NEC\"";
        break;
      case SONY:
        codeData += "\"type\":\"SONY\"";
        break;
      case PANASONIC:
        codeData += "\"type\":\"PANASONIC\"";
        break;
      case JVC:
        codeData += "\"type\":\"JVC\"";
        break;
      case RC5:
        codeData += "\"type\":\"RC5\"";
        break;
      case RC6:
        codeData += "\"type\":\"RC6\"";
        break;
      default:
        // we didn't get a supported code, restart recording
        recording = true;
        return false;
    }

    codeValue = results->value;
    codeLen = results->bits;
    codeData += ",\"length\":" + String(codeLen) + ",\"value\":\"" + String(codeValue, HEX) + "\"";
    lastIRCodeReceived = codeData;
    return true;
}

void transmitCode(String codeType, unsigned long codeValue, int codeLen, int shouldBlink) {
//  Serial.println("Transmitting: " + codeType + " " + String(codeValue, HEX) + " " + codeLen);
  if (codeType == "NEC") {
    irsend.sendNEC(codeValue, codeLen);
  } else if (codeType == "SONY") {
    irsend.sendSony(codeValue, codeLen);
  } else if (codeType == "PANASONIC") {
    irsend.sendPanasonic(codeValue, codeLen);
  } else if (codeType == "JVC") {
    irsend.sendPanasonic(codeValue, codeLen);
  } else if (codeType == "RC5" || codeType == "RC6") {
    toggle = 1 - toggle;

    // Put the toggle bit into the code to send
    codeValue = codeValue & ~(1 << (codeLen - 1));
    codeValue = codeValue | (toggle << (codeLen - 1));
    if (codeType == "RC5") {
      irsend.sendRC5(codeValue, codeLen);
    }
    else {
      irsend.sendRC6(codeValue, codeLen);
    }
  }
  irrecv.enableIRIn(); // Re-enable receiver

  // TODO: Write non-blocking blink method
  if (shouldBlink == 1) {
      blockingBlink(true, false, true, 50, 50, 2);
   }

}
