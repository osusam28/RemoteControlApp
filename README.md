# RemoteControlApp
There are two separate projects in this repository, ionic-tabs-lights (ionic mobile application) and ESP8266_cloud_test (embedded arduino application).  
They are meant to work together to allow the client application to control an I/O pin on an ESP8266 arduino device (or with proper configuration, any WiFi enabled arduino device). This is made possible through the [aREST project](https://arest.io/), which gives HTTP REST access to an arduino/raspberry pi device via their library and MQTT server.  

## Configuration
See the README in the ionic-tabs-lights directory to learn how to set up the project to run locally on your development machine, or compile it as an application on your Android or iOS device.  

Also see [this guide](https://ionicframework.com/getting-started/) on the Ionic website to get started.

To configure the arduino code, find this code snippet in the ESP8266_cloud_test code:
```
// Unique ID to identify the device for cloud.arest.io
char* device_id = "m8e4r5";

// WiFi parameters
const char* ssid = "slow internet :(";
const char* password = "loldidntread";
```
Change the device_id to whatever you would like to identify that device by.  It must be 6 characters long and contain only lowercase letters and numbers.  
Change the ssid and password variables to your local Wifi connection's SSID and network password. 
Upload the code to your arduino device. To connect to the device on the client application, use the device_id you defined, plus x#, where # is the pin number of the pin you would like to control (e.g. skh3w4x12 would be for a device_id of skh3w4 and control pin 12, while ms3wn3x3 would be for device_id ms3wn3 and pin 3). 
