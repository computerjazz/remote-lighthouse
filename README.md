# ir-mobile

## React Native App + Arduino Uno + ESP8266 WiFi module. 

Replace every remote control in your house with a single app. ir-mobile will listen to the infrared codes your remote controls emit and map them to buttons in the app.

### API

- GET `ESP_IP_ADDRESS/rec`: puts hardware in 'listening' mode for IR codes
- GET `ESP_IP_ADDRESS/stop`: stops record mode
- GET `ESP_IP_ADDRESS/check`: returns value of any IR codes heard
- GET `ESP_IP_ADDRESS/send?type=CODE_TYPE&value=CODE_VALUE&length=CODE_LENGTH`: transmit code via IR

I had to use two slightly different wiring configurations: one for uploading code and one for running my sketch. The 'upload' config _will_ work to run, but the ESP8266 won't reload your code after reboot, meaning you'll need to re-upload your sketch every time it boots. [Check the Boot Mode docs for wiring](https://arduino-esp8266.readthedocs.io/en/latest/boards.html#boot-messages-and-modes). 

You'll select the USB module on the left of the Upload schematic as your board/serial port in the Arduino IDE (I used [this one](https://www.amazon.com/gp/product/B01HXT8DZ4/ref=oh_aui_detailpage_o04_s00?ie=UTF8&psc=1))

### Upload code
![upload schematic](http://i.imgur.com/w0WYHbT.jpg)

### Run
![run schematic](http://i.imgur.com/kK3IYOr.jpg)

Note that the previous images depict only ESP8266 <=> Arduino connection, not the IR components.
