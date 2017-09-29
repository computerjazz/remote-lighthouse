# Remote Lighthouse

## React Native App + Arduino Uno + ESP32 WiFi module

Replace every remote control in your house with a single app. ir-mobile will listen to the infrared codes your remote controls emit and map them to buttons in the app.

### Hardware
- Arduino Uno
- ESP32 WiFi/Bluetooth Module
- IR Transmitter LEDs
- IR receiver component
- rgbLED
- various resistors/transistors


### You will need to install
- [ESP8266 library](https://github.com/esp8266/Arduino#installing-with-boards-manager)
- [Arduino IRemote library](https://github.com/z3t0/Arduino-IRremote#irremote-arduino-library)

### API
- GET `ESP_IP_ADDRESS/rec`: puts hardware in 'listening' mode for IR codes
- GET `ESP_IP_ADDRESS/stop`: stops record mode
- GET `ESP_IP_ADDRESS/send?type=CODE_TYPE&value=CODE_VALUE&length=CODE_LENGTH`: transmit code via IR
- GET `ESP_IP_ADDRESS/check`: returns value of any IR codes heard
```
  // Successful call to /check returns the following JSON object
  {
      type: oneof 'NEC', 'JVC', 'PANASONIC', 'RC5', 'RC6',
      value: hex string representing an unsigned long,
      length: length of the IR code in bits
  }
```


Where `ESP_IP_ADDRESS` is the address of the ESP on your network, for example `192.168.86.99`

### Wiring
![esp32 pinout](https://i.imgur.com/OJ5QfC6.jpg)

### Other references used:
- Reading IR codes: https://github.com/z3t0/Arduino-IRremote/blob/master/examples/IRrecord/IRrecord.ino
- Setting up server on ESP8266/ESP32: https://tttapa.github.io/ESP8266/Chap10%20-%20Simple%20Web%20Server.html
- Reading query params: https://techtutorialsx.com/2016/10/22/esp8266-webserver-getting-query-parameters/
- USB to UART driver (necessary to see ESP32 as a serial port): https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers
