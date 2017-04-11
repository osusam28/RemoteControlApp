angular.module('starter.filters', [])

.filter('groupFtr', function () {
    return function (input, groupName) {
        var buttons = [];

        for (var i = 0; i < input.length; i++) {
            if ((input[i].group == '' || input[i].group == undefined) && groupName == 'UNSPECIFIED') {
                buttons.push(input[i]);
            }
            else if (input[i].group == undefined) {

            }
            else if (input[i].group.toUpperCase() == groupName) {
                buttons.push(input[i]);
            }
        }

        return buttons;
    }
})

.filter('deviceTypeFtr', function (deviceTypesFactory) {
    return function (input) {
        return deviceTypesFactory.name(input);
    }
});