angular.module("bandstagram")
    .factory("authRouteFactory", function ($timeout, $state) {

        //this function is takes the user object and routes the user to their home page or if no user is passed in it will route to the auth page

        return function (user) {
            if (user) {

                if (user.displayName === "band" || user.displayName === "fan") {
                    $state.go(user.displayName + ".home")
                } else {
                    $state.go('register')
                }

            } else {
                console.log("User is not authenticated")
                $timeout(function () {
                    $state.go("auth")
                }, 100)
            }
        }
    })

    .factory("authFactory", function ($http, $timeout, $location, $state, authRouteFactory, $cordovaOauth, facebookFactory, FACEBOOK_CONSTANT) {

        //firebase auth observer - triggers the route function above
        firebase.auth().onAuthStateChanged(function (user) {
            authRouteFactory(user)
        })
        
        return Object.create(null, {
            //not sure I use this
            isAuthenticated: {
                value: () => {
                    const user = currentUserData
                    return user ? true : false
                }
            },
            //or this
            getUser: {
                value: () => firebase.auth().currentUser
            },
            //logout triggered by persistant logout button
            logout: {
                value: () => firebase.auth().signOut().then(console.log("User is signed out"))
            },
            //sign into firebase with email / password
            authenticate: {
                value: credentials =>
                firebase.auth()
                .signInWithEmailAndPassword(
                    credentials.email,
                    credentials.password
                ).then(user => user)
            },
            //register a new account with email / password
            registerWithEmail: {
                value: user =>
                firebase.auth()
                .createUserWithEmailAndPassword(
                    user.email,
                    user.password
                )
            },
            //login with facebook - oh boy
            loginWithFacebook: {
                value: function() {

                    //if you are on mobile
                    if(window.cordova){

                        //get facebook login token
                        $cordovaOauth.facebook(FACEBOOK_CONSTANT.appID, ["email", "user_likes"]).then(function(result) {
                            
                            //save facebook access token to the facebook factory for graph api call
                            facebookFactory.setFbToken(result.access_token)
                            
                            //pull credentails from facebook token
                            var credential = firebase.auth.FacebookAuthProvider.credential(result.access_token)
                            
                            //sign into firebase with the credentials
                            firebase.auth().signInWithCredential(credential).catch(function(error) {console.log(JSON.stringify(error))})
                            
                        }, function(error) {
                            console.log("ERROR: " + error);
                        });
                    } else {
                        //on desktop login with facebook popup
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
