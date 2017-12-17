

angular.module('bandstagram')
    .controller('authCtrl', function ($scope, $state, databaseFactory, authFactory, $ionicModal) {

        $scope.auth = {
            "email": null,
            "password": null,
            "account": null,
            "photoURL": null
        }

        $scope.userInfo = {
            "uid": null
        }


        $scope.logMeIn = function () {
            authFactory.authenticate($scope.auth).then(function (didLogin) {
                $scope.login = {}
            })
        }

        $scope.registerUser = function () {
            $scope.openModal()
        }

        $scope.console = function () {
            console.log($scope.userInfo)
            console.log($scope.auth)
        }


        $ionicModal.fromTemplateUrl('app/auth/partial/modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function () {
            $scope.modal.show();
        };

        $scope.closeModal = function (bool) {
            $scope.modal.hide();
            if (bool) {
                authFactory.registerWithEmail($scope.auth)
                    .then(function (user) {
                        user.updateProfile({ "displayName" : $scope.auth.account })
                        $scope.userInfo.uid = user.uid
                        databaseFactory.postUserInfo($scope.auth.account, $scope.userInfo)
                        authFactory.logout()
                        $scope.logMeIn()
                    })
            }
        };
    });

