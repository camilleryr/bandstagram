angular.module("bandstagram")
    .factory("authRouteFactory", function ($timeout, $state) {
        return function (user) {
            if (user) {

                if (user.displayName === "band" || user.displayName === "fan") {
                    $state.go(user.displayName + ".home")
                } else {
                    $state.go('register')
                }

            } else {
                currentUserData = null
                console.log("User is not authenticated")
                $timeout(function () {
                    $state.go("auth")
                }, 100)
            }
        }
    })

    .factory("authFactory", function ($http, $timeout, $location, $state, authRouteFactory, $cordovaOauth, facebookFactory) {

        firebase.auth().onAuthStateChanged(function (user) {
            authRouteFactory(user)
        })

        return Object.create(null, {
            isAuthenticated: {
                value: () => {
                    const user = currentUserData
                    return user ? true : false
                }
            },
            getUser: {
                value: () => firebase.auth().currentUser
            },
            logout: {
                value: () => firebase.auth().signOut().then(console.log("User is signed out"))
            },
            authenticate: {
                value: credentials =>
                    firebase.auth()
                        .signInWithEmailAndPassword(
                        credentials.email,
                        credentials.password
                        ).then(user => user)
            },
            registerWithEmail: {
                value: user =>
                    firebase.auth()
                        .createUserWithEmailAndPassword(
                        user.email,
                        user.password
                        )
            },
            loginWithFacebook: {
                value: function() {
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
            }
        })
    })
