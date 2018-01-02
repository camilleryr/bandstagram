angular.module('bandstagram')
.controller('navCtrl', function($scope, $state, authFactory) {
    //set function of persistant logout button
    $scope.logoutUser = function () {
        authFactory.logout()
    }
})