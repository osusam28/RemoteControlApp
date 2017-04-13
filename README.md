# RemoteControlApp
There are two separate projects in this repository, ionic-tabs-lights (ionic mobile application) and ESP8266_cloud_test (embedded arduino application).  
They are meant to work together to allow the client application to control an I/O pin on an ESP8266 arduino device (or with proper configuration, any WiFi enabled arduino device). This is made possible through the [aREST project](https://arest.io/), which gives HTTP REST access to an arduino/raspberry pi device via their library and MQTT server.  

## Configuration
See the README in the ionic-tabs-lights directory to learn how to set up the project to run locally on your development machine, or compile it as an application on your Android or iOS device.  

Also see [this guide](https://ionicframework.com/getting-started/) on the Ionic website to get started.
