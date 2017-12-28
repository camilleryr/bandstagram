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

    .factory("authFactory", function ($http, $timeout, $location, $state, authRouteFactory) {

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
            }
        })
    })
