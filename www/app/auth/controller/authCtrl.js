

angular.module('bandstagram')
    .controller('authCtrl', function ($scope, $state, databaseFactory, authFactory, photoFactory, $ionicModal, $firebaseAuth, $cordovaOauth) {

        var fb = firebase.database().ref()

        $scope.placeholder = photoFactory.placeholder

        $scope.takePicture = function () {
            photoFactory.takePhoto().then(result => {
                console.log(result)
                $scope.userInfo.photoURL = result
            })
        }

        $scope.auth = {
            "email": null,
            "password": null,
            "account": null,
        }
        
        $scope.logMeIn = function () {
            authFactory.authenticate($scope.auth).then(function (didLogin) {
                $scope.auth = {}
            })
        }
        
        $scope.registerUser = function () {
            authFactory.registerWithEmail($scope.auth).then(user => {
                $scope.user = user
                $scope.openModal()
            })
        }
        
        $scope.signupFacebook = function() {
            debugger
            var auth = $firebaseAuth(fb)
            console.log(auth)

            $cordovaOauth.facebook("172907863311544", ["email"]).then(function(result) {
                console.log(JSON.stringify(result))
                auth.$authWithOAuthToken("facebook", result.access_token).then(function(authData) {
                    console.log(JSON.stringify(authData));
                }, function(error) {
                    console.error("ERROR: " + error);
                });
            }, function(error) {
                console.log("ERROR: " + error);
            });
        }
        
        
        $ionicModal.fromTemplateUrl('app/auth/partial/modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        
        $scope.openModal = function () {
            $scope.userInfo = {}
            $scope.modal.show();
        };

        $scope.closeModal = function (bool) {
            $scope.modal.hide();
            if (bool) {
                console.log("save")
                $scope.user.updateProfile({ "displayName": $scope.auth.account })
                $scope.userInfo.uid = $scope.user.uid
                console.log($scope.userInfo)
                databaseFactory.postUserInfo($scope.auth.account, $scope.userInfo)
                authFactory.logout()
                $scope.logMeIn()
            }
        }
    })

