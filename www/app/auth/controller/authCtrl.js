

angular.module('bandstagram')
    .controller('authCtrl', function ($scope, $state, databaseFactory, authFactory, photoFactory, $ionicModal, $firebaseAuth, $cordovaOauth, facebookFactory) {

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
                // $scope.user = user
                // $scope.openModal()
            })
        }
        
        $scope.signupFacebook = function() {
            
            // var provider = new firebase.auth.FacebookAuthProvider();
            if(window.cordova){

                $cordovaOauth.facebook("172907863311544", ["email", "user_likes"]).then(function(result) {
                    console.log(JSON.stringify(result))

                    facebookFactory.setFbToken(result.access_token)
                    
                    var credential = firebase.auth.FacebookAuthProvider.credential(result.access_token)
                    
                    firebase.auth().signInWithCredential(credential).catch(function(error) {console.log(JSON.stringify(error))})
                    
                }, function(error) {
                    console.log("ERROR: " + error);
                });
            } else {
                
                var provider = new firebase.auth.FacebookAuthProvider();
                provider.addScope('user_likes')
                
                firebase.auth().signInWithPopup(provider).then(function(result) {
                    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                    facebookFactory.setFbToken(result.credential.accessToken)

                  }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                  });
            }
        }
        
        
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

