angular
    .module("bandstagram")
    .factory("databaseFactory", function ($http, FIREBASE_CONFIG) {

        return Object.create(null, {

            "getTable": {
                value: function (tableName) {
                    return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        return $http({
                            method: "GET",
                            url: `${FIREBASE_CONFIG.databaseURL}/${tableName}/.json?auth=${idToken}`
                        }).then(response => {
                            const data = response.data
        
                            let dataArray = 
                                Object.keys(data)
                                    .map(key => {
                                        data[key].id = key
                                        return data[key]
                                    })
        
                            return dataArray
                        })
                    })
                }
            },
            "getBand": {
                value: function (fbID) {
                    return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        return $http({
                            method: "GET",
                            url: `${FIREBASE_CONFIG.databaseURL}/bandTable/${fbID}/.json?auth=${idToken}`
                        }).then(response => {
                            return response.data       
                        })
                    })
                }
            },
            "getSongsByBand": {
                value: function (uid) {
                    return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        return $http({
                            method: "GET",
                            url: `${FIREBASE_CONFIG.databaseURL}/recordingTable/.json?auth=${idToken}&orderBy="bandUID"&equalTo="${uid}"`
                        }).then(response => {
                            return Object.values(response.data)       
                        })
                    })
                }
            },
            "postUserInfo": {
                value: function (accountType, userInfo) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "POST",
                                url: `${FIREBASE_CONFIG.databaseURL}/${accountType}Table/.json?auth=${idToken}`,
                                data: userInfo
                            })
                        }
                    )
                }
            },
            "postRecordingInfo": {
                value: function (recordingInfo) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "POST",
                                url: `${FIREBASE_CONFIG.databaseURL}/recordingTable/.json?auth=${idToken}`,
                                data: recordingInfo
                            })
                        }
                    )
                }
            },
            "followBand": {
                value: function (bandID) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "POST",
                                url: `${FIREBASE_CONFIG.databaseURL}/followingTable/.json?auth=${idToken}`,
                                data: {"bandUID" : bandID, "fanUID" : firebase.auth().currentUser.uid}
                            })
                        }
                    )
                }
            },
        }
    )
})
