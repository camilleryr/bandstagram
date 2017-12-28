

angular.module('bandstagram')
    .controller('authCtrl', function ($scope, authFactory) {

        $scope.auth = {
            "email": null,
            "password": null
        }
        
        $scope.logMeIn = function () {
            authFactory.authenticate($scope.auth).then(function (didLogin) {
                $scope.auth = {}
            })
        }
        
        $scope.registerUser = function () {
            authFactory.registerWithEmail($scope.auth).then(user => {
                // $scope.user = user
                // $scope.openModal()
            })
        }
        
        $scope.signupFacebook = function() {
            authFactory.loginWithFacebook()
        }
    })

