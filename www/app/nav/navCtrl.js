angular.module('bandstagram')
.controller('navCtrl', function($scope, $state, authFactory) {
    $scope.logoutUser = function () {
        authFactory.logout()
    }
})