angular.module('starter.services', [])

.factory('deviceFactory', function () {
    var database = firebase.database();
    var dataKey = 'DEVICE_DEVICES'
    var device_data = {};

    //var getAll = function (callback) {
    //    database.ref(deviceKey).once('value')
    //    .then(function (snapshot) {
    //        callback(snapshot.val());
    //    })
    //    .catch(function () {
    //        callback(0);
    //    });
    //}

    var convertData = function (firebase_data) {
        var data = [];
        for (var key in firebase_data) {
            if (firebase_data.hasOwnProperty(key)) {
                data.push(firebase_data[key]);
            }
        }
        return data;
    }

    var getAll = function (callback) {
        database.ref(dataKey).on('value', function (data) {
            device_data = data.val();

            callback(convertData(device_data));
        });
    }

    var groups = function () {
        var names = [];
        for (var key in device_data) {
            if (device_data.hasOwnProperty(key) && device_data[key].group != undefined) {
                if (names.lastIndexOf(device_data[key].group.toUpperCase()) == -1) {
                    if (device_data[key].group == '') {
                        if (names.lastIndexOf('UNSPECIFIED') == -1) {
                            names.push('Unspecified'.toUpperCase());
                        }
                    }
                    else {
                        names.push(device_data[key].group.toUpperCase());
                    }
                }
            }
            else if (device_data[key].group == undefined) {
                if (names.lastIndexOf('UNSPECIFIED') == -1) {
                    names.push('Unspecified'.toUpperCase());
                }
            }
        }

        return names;
    }

    var submit = function (device, edit, callback) {
        if (edit) {
            for (var key in device_data) {
                if (device_data.hasOwnProperty(key)) {
                    if (device_data[key].id == device.id) {
                        break;
                    }
                }
            }
            database.ref(dataKey + "/" + key).update(angular.copy(device)).then(
                function () {
                    callback(true);
                }, function (error) {
                    callback(error);
                });
        }
        else {
            device.pin = getPin(device.id);
            device.id = getInternalID(device.id);

            var newKey = database.ref(dataKey).push().key;
            database.ref(dataKey + "/" + newKey).set(device).then(
                function () {
                    callback(true);
                }, function (error) {
                    callback(error);
                });
        }
    }

    var remove = function (device, callback) {
        for (var key in device_data) {
            if (device_data.hasOwnProperty(key)) {
                if (device_data[key].id == device.id) {
                    break;
                }
            }
        }
        return database.ref(dataKey + "/" + key).remove().then(
            function () {
                callback(true);
            }, function () {
                callback(error);
            });
    }

    var getPin = function (id) {
        var x = id.lastIndexOf('x');
        return id.substr(x + 1, id.length)
    }

    var getInternalID = function (id) {
        var x = id.lastIndexOf('x');
        return id.substr(0, x);
    }

    return {
        getAll: getAll,
        remove: remove,
        submit: submit,
        groups: groups,
    }
})

.factory('deviceActionsFactory', function ($http, $q) {

    var getDevicePromise = function(device, mode) {
        switch (mode) {
            case 0:
                return $http.get('https://cloud.arest.io/' + device.id);
                break;
            case 1:
                return $http.get('https://cloud.arest.io/' + device.id + '/mode/' + device.pin + '/o');
                break;
            case 2:
                return $http.get('https://cloud.arest.io/' + device.id + '/digital/' + device.pin + '/1');
                break;
            case 3:
                return $http.get('https://cloud.arest.io/' + device.id + '/digital/' + device.pin + '/0');
                break;
            case 4:
                return $http.get('https://cloud.arest.io/' + device.id + '/digital/' + device.pin);
                break;
            default:
                return 0;
                break;
        }
    }

    var getIfActiveDevice = function (promise, callback) {
        promise.then(function (response) {
            if (response.data.message == null) {
                callback(true, response.data.id);
            }
            else {
                callback(false);
            }
        });
    }

    var setupDevice = function (device, callback) {
        getDevicePromise(device, 1).then(function (response) {
            callback(true);
        }, function (error) {
            callback(false);
        });
    }

    var triggerDevice = function (device) {
        switch (device.type) {
            case 0:
                getDevicePinValue(device, function (res) {
                    if (res == 1) {
                        getDevicePromise(device, 3);
                    }
                    else if (res == 0) {
                        getDevicePromise(device, 2);
                    }
                    else {

                    }
                });
                break;
            case 1:
                getDevicePromise(device, 2).then(function () {
                    getDevicePromise(device, 3);
                });
                break;
            default:
                return 0;
                break;
        }
    }

    var getDevicePinValue = function (device, callback) {
        getDevicePromise(device, 4).then(function (response) {
            if (response.data.return_value != null) {
                callback(response.data.return_value);
            }
        });
    }

    return {
        getDevicePromise: getDevicePromise,
        getIfActiveDevice: getIfActiveDevice,
        setupDevice: setupDevice,
        triggerDevice: triggerDevice
    }
})

.factory('deviceTypesFactory', function () {
    var database = firebase.database();
    var dataKey = 'DEVICE_TYPES'
    var UItypes = [];

    var getAll = function (callback) {
        database.ref(dataKey).once('value')
        .then(function (data) {
            var types = data.val();
            for (var key in types) {
                if (types.hasOwnProperty(key)) {
                    UItypes.push(types[key]);
                }
            }
            callback(UItypes);
        })
        .catch(function () {
            callback(0);
        });
    }

    var name = function (ID) {
        for (var i = 0; i < UItypes.length; i++) {
            if (UItypes[i].id == ID) {
                return UItypes[i].name;
            }
        }
    }

    var id = function () {

    }

    return {
        getAll: getAll,
        name: name,
        id: id
    }
});