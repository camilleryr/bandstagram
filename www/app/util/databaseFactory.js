angular
    .module("bandstagram")
    .factory("databaseFactory", function ($http, FIREBASE_CONFIG) {

        return Object.create(null, {

            "postUserInfo": {
                value: function (accountType, userInfo) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "POST",
                                url: `${FIREBASE_CONFIG.databaseURL}/${accountType}Table/.json?auth=${idToken}`,
                                data: userInfo
                            })
                        })
                }
            }
    })
})
