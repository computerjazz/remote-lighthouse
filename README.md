# Remote Lighthouse

## React Native App + Arduino Uno + ESP32 WiFi module

Replace every remote control in your house with a single app. ir-mobile will listen to the infrared codes your remote controls emit and map them to buttons in the app.

![hero](https://github.com/user-attachments/assets/cc7d7984-0a72-4eb7-a459-dd41338b58a2)


### Hardware
- ESP32 WiFi/Bluetooth Module
- IR Transmitter LEDs
- IR receiver component
- rgbLED
- various resistors/transistors


### You will need to install

- [Arduino IRemote library](https://github.com/z3t0/Arduino-IRremote#irremote-arduino-library)
- [bbx10's esp32 ports](https://github.com/tzapu/WiFiManager/issues/241#issuecomment-307559253p)

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

## Flash bin to ESP-32
- ```./esptool.py --port /dev/tty.SLAB_USBtoUART write_flash --flash_mode qio --flash_size 4MB --flash_freq 80m 0x10000 /Users/danielmerrill/Dev/ir-mobile/ESP32-ir-mobile/ESP32-ir-mobile.ino.esp32.bin``` 
- Run from the folder where you downloaded esptool above^^
replace the serial port after --port with whatever the esp32 is listed as, and the path for the .bin and you should be good to go
- Once flashed you can verify it's working by restarting the esp32 with the serial monitor open in Arduino IDE

### Other references used:
- Reading IR codes: https://github.com/z3t0/Arduino-IRremote/blob/master/examples/IRrecord/IRrecord.ino
- Setting up server on ESP8266/ESP32: https://tttapa.github.io/ESP8266/Chap10%20-%20Simple%20Web%20Server.html
- Reading query params: https://techtutorialsx.com/2016/10/22/esp8266-webserver-getting-query-parameters/
- USB to UART driver (necessary to see ESP32 as a serial port): https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers
