# ir-mobile

## Control any device that has an IR remote with your phone. 

Create an IR listener/transmitter using an Arduino Uno and an ESP8266 WiFi module. Sending a GET req to `ESP_IP_ADDRESS/rec` will put the Arduino in to record mode. Once it senses a valid IR code, visit `ESP_IP_ADDRESS/check` to retrieve it.

Codes can be transmitted via `ESP_IP_ADDRESS/send?type=CODE_TYPE&value=CODE_VALUE&length=CODE_LENGTH`
