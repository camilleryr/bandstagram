

angular.module('bandstagram')
    .controller('registerCtrl', function ($scope, $state, databaseFactory, authRouteFactory, photoFactory, $timeout, $ionicPopup, facebookFactory) {

        // get user info
        let user = firebase.auth().currentUser

        $scope.userInfo = {}
        $scope.auth = {}
        $scope.placeholder = photoFactory.placeholder

        //if the user is registering with facebook - prepopulate their photo with their profile photo
        if (user.photoURL) {
            $scope.userInfo.photoURL = user.photoURL
        }

        //if the user is registering with facebook - prepopulate their name with their profile name
        if (user.displayName) {
            $scope.userInfo.bandName = user.displayName
            $scope.userInfo.fanName = user.displayName

        }

        //create the entry in the correct user table
        $scope.register = function (bool) {
            if (bool) {

                //change the "displayName" property on the firebase user object, this is used for routing and permissions
                user.updateProfile({ "displayName": $scope.auth.account })

                //clean up a hacky pice of data
                if ($scope.auth.account === 'fan') {
                    delete $scope.userInfo.bandName
                } else if ($scope.auth.account === 'band') {
                    delete $scope.userInfo.fanName
                }

                //pull the firebase uid so we can save it to the firebaseDB
                $scope.userInfo.uid = user.uid

                //save the user info to firebaseDB
                databaseFactory.postUserInfo($scope.auth.account, $scope.userInfo)
                    .then(e => {

                        //if the user is registering a new account with facebook - present them with a pop up to import info from their account
                        if (user.providerData[0].providerId === "facebook.com" && $scope.auth.account === 'fan') {
                            var confirmPopup = $ionicPopup.confirm({
                                title: 'Import Favorites',
                                template: 'Would you like to have us import the bands you like on facebook?'
                            });
                            
                            confirmPopup.then(function (res) {
                                if (res) {
                                    //if they approve the facebook import - pull their music info from the facebook graph api, compare to the band table, and friend any matches
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
    })

