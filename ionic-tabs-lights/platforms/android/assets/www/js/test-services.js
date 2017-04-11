angular.module('starter.testservices', [])

.factory('Devices', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    
    var devices = [{
        id: 'e4t5y6',
        name: 'Living Room Lights',
        type: 0,
        group: ''
    }, {
        id: 'f3g6j2',
        name: 'Roof lights',
        type: 1,
        group: 'Christmas lights'
    }, {
        id: 'gfh53f',
        name: 'Porch lights',
        type: 1,
        group: 'Christmas Lights'
    }, {
        id: 'g47hu7',
        name: 'Door lights',
        type: 1,
        group: 'Christmas Lights'
    }];
    

    return {
        all: function () {
            return devices;
        },
        remove: function (device) {
            devices.splice(devices.indexOf(device), 1);
        },
        get: function (deviceName) {
            for (var i = 0; i < devices.length; i++) {
                if (devices[i].name === deviceName) {
                    return devices[i];
                }
            }
            return null;
        },
        add: function (device, edit) {
            if (edit) {
                for (var i = 0; i < devices.length; i++) {
                    if (devices[i].id === device.id) {
                        devices[i] = device;
                        break;
                    }
                }
            }
            else {
                devices.push(device);
            }
            return null;
        },
        groups: function () {
            var names = [];
            for (var i = 0; i < devices.length; i++) {
                if (names.lastIndexOf(devices[i].group.toUpperCase()) == -1) {
                    if (devices[i].group == '') {
                        names.push('Unspecified'.toUpperCase())
                    }
                    else {
                        names.push(devices[i].group.toUpperCase());
                    }
                }
            }
            return names;
        },
        types: function () {
            return
        }
    }
})

.factory('DeviceTypes', function () {
    var types = [{
            id: 0,
            name: 'toggle'
        },
        {
            id: 1,
            name: 'pushbutton'
        }];

    return {
        all: function () {
            return types;
        },
        name: function (ID) {
            for (var i = 0; i < types.length; i++) {
                if (types[i].id == ID) {
                    return types[i].name;
                }
            }
        },
        id: function (name) {
            for (var i = 0; i < types.length; i++) {
                if (types[i].name == name) {
                    return types[i].id;
                }
            }
        }
    }
});



