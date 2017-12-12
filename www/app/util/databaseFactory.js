angular
    .module("bandstagram")
    .factory("databaseFactory", function ($http) {

        return Object.create(null, {

            "postUserInfo": {
                value: function (accountType, userInfo) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "POST",
                                url: `https://bandstagram-2155c.firebaseio.com/${accountType}Table/.json?auth=${idToken}`,
                                data: userInfo
                            })
                        })
                }
            }
    })
})
