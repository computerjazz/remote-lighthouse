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

    if (IR_DEBUG) {
      dumpInfo(&results);           // Output the results
      dumpRaw(&results);            // Output the results in RAW format
      dumpCode(&results);           // Output the results as source code
      Serial.println("TYPE: " + String(results.decode_type));
      Serial.println("IS REPEAT? " + String(results.value == REPEAT));
          bool isUnknown = results.decode_type == UNKNOWN;

      Serial.println("IS UNKNOWN? " + String(isUnknown));
      Serial.println("IS NEC? " + String(results.decode_type == NEC));
      Serial.println("RAW_LEN: " + String(results.rawlen));
      Serial.println("OVERFLOW: " + String(results.overflow));
      Serial.println("ADDRSSS: " + String(results.address));
      Serial.println("BITS: " + String(results.bits));
      Serial.println("VALUE: " + String(results.value));

      Serial.println("");

    }

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
  codeType = results->decode_type;
  int count = results->rawlen;
  unsigned int rawCodes[RAWBUF]; // The durations if raw
  // TODO: add LED green blink feedback on successful storage of supported code

  String codeData = "";
  String rawCodeStr = "";

  {
    codeType = results->decode_type;
    //int count = results->rawlen;
    if (codeType == UNKNOWN) {
      codeLen = results->rawlen - 1;
      // To store raw codes:
      // Drop first value (gap)
      // Convert from ticks to microseconds
      // Tweak marks shorter, and spaces longer to cancel out IR receiver distortion
      for (int i = 1; i <= codeLen; i++) {
        if (i % 2) {
          // Mark
          rawCodes[i - 1] = results->rawbuf[i] * USECPERTICK;
        }
        else {
          // Space
          rawCodes[i - 1] = results->rawbuf[i] * USECPERTICK;
        }
      }
      codeData += "\"type\":\"UNKNOWN\"";
      codeData += ",\"length\":" + String(codeLen);

      for (int i = 0; i < codeLen; i++) {
        rawCodeStr += String(rawCodes[i]) + "-";
      }
      codeData += ",\"value\":\"" + String(rawCodeStr) + "\"";
      lastIRCodeReceived = codeData;
      if (codeLen < 8) {
        // we didn't get a valid code, restart recording
        recording = true;
        return false;
      } else {
        return true;
      }
    } else {
      switch (codeType) {
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
        case SAMSUNG:
          codeData += "\"type\":\"SAMSUNG\"";
          break;
        case WHYNTER:
          codeData += "\"type\":\"WHYNTER\"";
          break;
        case AIWA_RC_T501:
          codeData += "\"type\":\"AIWA_RC_T501\"";
          break;
        case LG:
          codeData += "\"type\":\"LG\"";
          break;
        case SANYO:
          codeData += "\"type\":\"SANYO\"";
          break;
        case MITSUBISHI:
          codeData += "\"type\":\"MITSUBISHI\"";
          break;
        case DISH:
          codeData += "\"type\":\"DISH\"";
          break;
        case SHARP:
          codeData += "\"type\":\"SHARP\"";
          break;
        case DENON:
          codeData += "\"type\":\"DENON\"";
          break;
        case PRONTO:
          codeData += "\"type\":\"PRONTO\"";
          break;
        case LEGO_PF:
          codeData += "\"type\":\"LEGO_PF\"";
          break;

        default:
          // we didn't get a supported code, restart recording
          codeData += "\"type\":\"UNKNOWN\"";
      }
      codeValue = results->value;
      codeLen = results->bits;
      codeData += ",\"length\":" + String(codeLen) + ",\"value\":\"" + String(codeValue, HEX) + "\"";
      lastIRCodeReceived = codeData;
    }

    return true;
  }


}

void transmitRawCode(String s, int codeLen) {
  char str[s.length()];
  s.toCharArray(str, s.length());
  unsigned int rawCodes[codeLen];

  // Returns first token
  char *token = strtok(str, "-");

  // Keep printing tokens while one of the
  // delimiters present in str[].
  int i = 0;
  while (token != NULL)
  {
    rawCodes[i] = String(token).toInt();
    token = strtok(NULL, "-");
    i++;
  }
  irsend.sendRaw(rawCodes, codeLen, 38);
}

void transmitCode(String codeType, unsigned long codeValue, int codeLen) {
  //  Serial.println("Transmitting: " + codeType + " " + String(codeValue, HEX) + " " + codeLen);
  if (codeType == "NEC") {
    irsend.sendNEC(codeValue, codeLen);
  } else if (codeType == "SONY") {
    irsend.sendSony(codeValue, codeLen);
    delay(40);
    irsend.sendSony(codeValue, codeLen);
    delay(40);
    irsend.sendSony(codeValue, codeLen);
  } else if (codeType == "PANASONIC") {
    irsend.sendPanasonic(codeValue, codeLen);
  } else if (codeType == "JVC") {
    // JVC must be sent multiple times
    irsend.sendJVC(codeValue, codeLen, 0);
    delay(20);
    irsend.sendJVC(codeValue, codeLen, 1);
    delay(20);
    irsend.sendJVC(codeValue, codeLen, 1);
  } else if (codeType == "LG") {
    irsend.sendLG(codeValue, codeLen);
  } else if (codeType == "AIWA_RC_T501") {
    irsend.sendAiwaRCT501(codeValue);
  } else if (codeType == "SAMSUNG") {
    irsend.sendSAMSUNG(codeValue, codeLen);
  } else if (codeType == "WHYNTER") {
    irsend.sendWhynter(codeValue, codeLen);
  } else if (codeType == "SANYO") {
    // no sanyo send
  } else if (codeType == "MITSUBISHI") {
    // not written
  } else if (codeType == "DISH") {
    irsend.sendDISH(codeValue, codeLen);
  } else if (codeType == "SHARP") {
    irsend.sendSharpRaw(codeValue, codeLen);
  } else if (codeType == "DENON") {
    irsend.sendDenon(codeValue, codeLen);
  } else if (codeType == "PRONTO") {
    // differnet format
  }  else if (codeType == "LEGO_PF") {
    irsend.sendLegoPowerFunctions(codeValue, false);
  } else if (codeType == "UNKNOWN") {
    // Handled by transmitRawCode()
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

}

