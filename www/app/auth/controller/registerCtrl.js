

angular.module('bandstagram')
    .controller('registerCtrl', function ($scope, $state, databaseFactory, authRouteFactory, photoFactory, $timeout, $ionicPopup, facebookFactory) {

        let user = firebase.auth().currentUser
        // console.log(user)

        $scope.userInfo = {}
        $scope.auth = {}
        $scope.placeholder = photoFactory.placeholder

        if (user.photoURL) {
            $scope.userInfo.photoURL = user.photoURL
        }
        if (user.displayName) {
            $scope.userInfo.bandName = user.displayName
            $scope.userInfo.fanName = user.displayName

        }

        $scope.register = function (bool) {
            if (bool) {
                user.updateProfile({ "displayName": $scope.auth.account })
                if ($scope.auth.account === 'fan') {
                    delete $scope.userInfo.bandName
                } else if ($scope.auth.account === 'band') {
                    delete $scope.userInfo.fanName
                }
                $scope.userInfo.uid = user.uid
                databaseFactory.postUserInfo($scope.auth.account, $scope.userInfo)
                    .then(e => {
                        if (user.providerData[0].providerId === "facebook.com" && $scope.auth.account === 'fan') {
                            var confirmPopup = $ionicPopup.confirm({
                                title: 'Import Favorites',
                                template: 'Would you like to have us import the bands you like on facebook?'
                            });

                            confirmPopup.then(function (res) {
                                if (res) {
                                    facebookFactory.importFavorites()
                                    console.log('You are sure');
                                } else {
                                    console.log('You are not sure');
                                }
                            }).then(() => $timeout(() => authRouteFactory(user), 100))
                        } else {
                            $timeout(() => authRouteFactory(user), 100)
                        }
                    })
            }
        }


        $scope.takePicture = function () {
            photoFactory.takePhoto().then(result => {
                console.log(result)
                $scope.userInfo.photoURL = result
            })
        }

        // $scope.auth = {
        //     "email": null,
        //     "password": null,
        //     "account": null,
        // }

        // $scope.logMeIn = function () {
        //     authFactory.authenticate($scope.auth).then(function (didLogin) {
        //         $scope.auth = {}
        //     })
        // }

        // $scope.registerUser = function () {
        //     authFactory.registerWithEmail($scope.auth).then(user => {
        //         $scope.user = user
        //         $scope.openModal()
        //     })
        // }

        // $scope.signupFacebook = function() {

        //     // var provider = new firebase.auth.FacebookAuthProvider();
        //     if(window.cordova){

        //         $cordovaOauth.facebook("172907863311544", ["email"]).then(function(result) {
        //             console.log(JSON.stringify(result))

        //             var credential = firebase.auth.FacebookAuthProvider.credential(result.access_token)

        //             firebase.auth().signInWithCredential(credential).catch(function(error) {console.log(JSON.stringify(error))})

        //         }, function(error) {
        //             console.log("ERROR: " + error);
        //         });
        //     } else {

        //         var provider = new firebase.auth.FacebookAuthProvider();

        //         firebase.auth().signInWithPopup(provider).then(function(result) {
        //             // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        //             var token = result.credential.accessToken;
        //             // The signed-in user info.
        //             var user = result.user;
        //             // ...
        //           }).catch(function(error) {
        //             // Handle Errors here.
        //             var errorCode = error.code;
        //             var errorMessage = error.message;
        //             // The email of the user's account used.
        //             var email = error.email;
        //             // The firebase.auth.AuthCredential type that was used.
        //             var credential = error.credential;
        //             // ...
        //           });
        //     }
        // }


        // $ionicModal.fromTemplateUrl('app/auth/partial/modal.html', {
        //     scope: $scope,
        //     animation: 'slide-in-up'
        // }).then(function (modal) {
        //     $scope.modal = modal;
        // });

        // $scope.openModal = function () {
        //     $scope.userInfo = {}
        //     $scope.modal.show();
        // };

        // $scope.closeModal = function (bool) {
        //     $scope.modal.hide();
        //     if (bool) {
        //         console.log("save")
        //         $scope.user.updateProfile({ "displayName": $scope.auth.account })
        //         $scope.userInfo.uid = $scope.user.uid
        //         console.log($scope.userInfo)
        //         databaseFactory.postUserInfo($scope.auth.account, $scope.userInfo)
        //         authFactory.logout()
        //         $scope.logMeIn()
        //     }
        // }
    })

