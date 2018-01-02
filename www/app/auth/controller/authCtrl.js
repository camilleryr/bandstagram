

angular.module('bandstagram')
    .controller('authCtrl', function ($scope, authFactory) {

        $scope.auth = {
            "email": null,
            "password": null
        }
        
        //authenticate a user with an account using email and password
        $scope.logMeIn = function () {
            authFactory.authenticate($scope.auth).then(function (didLogin) {
                $scope.auth = {}
            })
        }
        
        //authenticate a user and create a new account using email and password
        $scope.registerUser = function () {
            authFactory.registerWithEmail($scope.auth).then(user => {
                // $scope.user = user
                // $scope.openModal()
            })
        }
        
        //sign in with facebook - yay!
        $scope.signupFacebook = function() {
            authFactory.loginWithFacebook()
        }
    })

