angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope, $interval, $ionicLoading, deviceFactory, deviceActionsFactory,
    $http, $q, $rootScope) {

    $scope.init_devices = false;
    $scope.database_conn = false;
    $rootScope.activeDevices = [];

    var loading = function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    }

    if ($scope.devices == null) {
        loading();
    }

    var update = $interval(function () {
        if ($scope.database_conn) {
            $scope.checkIfDevicesActive();
            $scope.database_conn = false;
        }
        if ($scope.init_devices) {
            $interval.cancel(update);
            $ionicLoading.hide();
            $scope.init_devices = false;
        }
    },
    100, 0, true);

    deviceFactory.getAll(function (data) {
        $scope.devices = data;
        $scope.groups = deviceFactory.groups();
        $scope.database_conn = true;
    });

    $scope.isInactive = function (id) {
        for (var i = 0; i < $rootScope.activeDevices.length; i++) {
            if (id == $rootScope.activeDevices[i].id) {
                return false;
            }
        }
        return true;
    }

    $scope.$on('$ionicView.enter', function (e) {

    });

    $scope.$on('$ionicView.beforeLeave', function () {
        $interval.cancel(update);
    });

    $scope.checkIfDevicesActive = function (refresh) {
        var promises = [];
        $rootScope.activeDevices = [];

        for (var i = 0; i < $scope.devices.length; i++) {
            promises.push(deviceActionsFactory.getDevicePromise($scope.devices[i], 0));
        }

        for (var i = 0; i < promises.length; i++) {
            deviceActionsFactory.getIfActiveDevice(promises[i], function (active, id) {
                if (active) {
                    for (var i = 0; i < $scope.devices.length; i++) {
                        if ($scope.devices[i].id.includes(id) &&
                            !$rootScope.activeDevices.includes($scope.devices[i])) {
                            $rootScope.activeDevices.push($scope.devices[i]);
                            break;
                        }
                    }
                }
            });
        }

        $q.all(promises).then(function () {
            setupActiveDevices();
        });
    }

    var setupActiveDevices = function () {
        for (var i = 0; i < $rootScope.activeDevices.length; i++) {
            deviceActionsFactory.setupDevice($rootScope.activeDevices[i], function (res) {
                if (!res) {
                    //do something
                }
            });
        }
        $scope.init_devices = true;
    }

    $scope.triggerDevice = function (device) {
        deviceActionsFactory.triggerDevice(device);
    }
})

.controller('DevicesCtrl', function ($scope, deviceFactory, deviceTypesFactory, deviceActionsFactory,
    $ionicLoading, $ionicModal, $interval, $ionicPopup, $q, $rootScope) {

    $scope.updated_devs = false;
    $scope.updated_types = false;
    $scope.delete = false;

    var loading = function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    }

    var confirmDelete = function (device) {
        return $ionicPopup.confirm({
            title: 'Confirm Action',
            template: 'Are you sure you want to delete ' + device.name + '?'
        });
    }

    var update = $interval(function () {
        if ($scope.updated_devs && $scope.updated_types) {
            $interval.cancel(update);
            $ionicLoading.hide();
            $scope.updated_devs = false;
        }
    },
    100, 0, true);

    deviceTypesFactory.getAll(function (data) {
        $scope.deviceTypes = data;
        $scope.updated_types = true;

        deviceFactory.getAll(function (data) {
            $scope.devices = data;
            $scope.updated_devs = true;
        });
    });

    $scope.remove = function (device) {
        confirmDelete(device).then(function (res) {
            if (res) {
                loading();
                deviceFactory.remove(device, function (result) {
                    $ionicLoading.hide();
                    $scope.toggleDelete();
                });
            }
        });
    };

    $scope.submitDevice = function (form) {
        loading();
        deviceFactory.submit($scope.subDevice, $scope.edit, function (result) {
            if ($scope.edit) {
                $ionicLoading.hide();
                $scope.cancelEdit();
            }
            else {
                $scope.checkIfDeviceActive($scope.subDevice).then(function () {
                    setupDevice($scope.subDevice).then(function () {
                        $ionicLoading.hide();
                    });
                });
                form.$setPristine();
                $scope.closeModal();
            }
        });
        return true;
    }

    $scope.toggleDelete = function() {
        $scope.delete = !$scope.delete;
    }

    $scope.checkIfDeviceActive = function (device) {
        var defer = $q.defer();
        deviceActionsFactory.getIfActiveDevice(deviceActionsFactory.getDevicePromise(device, 0),
            function (active, id) {
                if (active) {
                    $rootScope.activeDevices.push(device);
                }
                defer.resolve();
            });

        return defer.promise;
    }

    var setupDevice = function (device) {
        var defer = $q.defer();
        deviceActionsFactory.setupDevice(device, function (res) {
            if (!res) {
                //do something
            }
            defer.resolve();
        });

        return defer.promise;
    }

    $scope.$on('$ionicView.beforeLeave', function () {
        $interval.cancel(update);

    });

    $scope.$on('$ionicView.enter', function (e) {
          
    });

    //Edit Form Code

    $scope.edit = false;
    $scope.editID = '';

    $scope.startEdit = function (device) {
        if (!$scope.edit) {
            if ($scope.delete) {
                $scope.remove(device);
            }
            else {
                $scope.editID = device.id;
                $scope.subDevice = device;
                $scope.edit = true;
            }
        }
    };

    $scope.cancelEdit = function () {
        $scope.edit = false;
        $scope.editID = '';
    }

    //Modal code

    $scope.modalTitle = '';
    $scope.IDregex = "[A-Za-z0-9]{6}x1?[0-9]{1}"; //ID must be have six alphanumeric characters followed by an 'x' and an integer from 0-19

    $ionicModal.fromTemplateUrl('templates/device-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });


    $scope.openModal = function (device) {
        $scope.modalTitle = "Create New Device";
        $scope.subDevice = {};
        $scope.edit = false;

        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
        window.alert("hey");
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });
})


//.controller('ChatDetailCtrl', function ($scope, $stateParams, Devices) {
//    $scope.chat = Devices.get($stateParams.chatId);
//})

