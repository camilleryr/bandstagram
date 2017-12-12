angular.module("bandstagram")
.factory("authFactory", function ($http, $timeout, $location, $state) {
    
    let currentUserData = null

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            currentUserData = user
            console.log("User is authenticated as")
            console.dir(currentUserData)
                //write logic that will query the isband table to determine where to navigate the state - band or fan

        } else {
            currentUserData = null
            console.log("User is not authenticated")
            $timeout(function () {
                $state.go("auth")
            }, 100)
        }
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
                        ).then(function(user) {console.log(user)})
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