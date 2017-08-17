# ir-mobile

## A mobile app to replace all of your remotes 

Create an IR listener/transmitter using an Arduino Uno and an ESP8266 WiFi module. Sending a GET req to `ESP_IP_ADDRESS/rec` will put the Arduino in to record mode. Once it senses a valid IR code, visit `ESP_IP_ADDRESS/check` to retrieve it.

Codes can be transmitted via `ESP_IP_ADDRESS/send?type=CODE_TYPE&value=CODE_VALUE&length=CODE_LENGTH`

I had to use two slightly different wiring configurations: one for uploading code and one for running my sketch (the upload config _will_ work to run, but the ESP8266 won't reload your code after reboot, meaning you'll need to re-upload your sketch every time it boots. [Check the Boot Mode docs for wiring](https://arduino-esp8266.readthedocs.io/en/latest/boards.html#boot-messages-and-modes)). 

You'll select the USB module on the left of the Upload schematic as your board/serial port in the Arduino IDE (I used [this one](https://www.amazon.com/gp/product/B01HXT8DZ4/ref=oh_aui_detailpage_o04_s00?ie=UTF8&psc=1))

### Upload code
![upload schematic](http://i.imgur.com/w0WYHbT.jpg)

### Run
![run schematic](http://i.imgur.com/kK3IYOr.jpg)

Note that the previous images depict only ESP8266 <=> Arduino connection, not the IR components.
