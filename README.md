# ir-mobile

## Control any device that has an IR remote with your phone. 

Create an IR listener/transmitter using an Arduino Uno and an ESP8266 WiFi module. Sending a GET req to `ESP_IP_ADDRESS/rec` will put the Arduino in to record mode. Once it senses a valid IR code, visit `ESP_IP_ADDRESS/check` to retrieve it.

Codes can be transmitted via `ESP_IP_ADDRESS/send?type=CODE_TYPE&value=CODE_VALUE&length=CODE_LENGTH`

Wiring is tricky. I had to use different configurations for uploading code and for running (the upload config will work to run, but it won't reload your code when rebooting the ESP8266, [check the Boot Mode docs for wiring](https://arduino-esp8266.readthedocs.io/en/latest/boards.html#boot-messages-and-modes)). 

The USB module on the left of the Upload schematic is what you'll select as your board/serial port in the Arduino IDE (I used [this one](https://www.amazon.com/gp/product/B01HXT8DZ4/ref=oh_aui_detailpage_o04_s00?ie=UTF8&psc=1))

Here's the layout that worked for me:

### Upload code
![upload schematic](http://i.imgur.com/w0WYHbT.jpg)

### Run
![run schematic](http://i.imgur.com/kK3IYOr.jpg)

Note that the previous images depict only ESP8266 <=> Arduino connection, not the IR components.
