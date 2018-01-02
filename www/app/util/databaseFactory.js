angular
    .module("bandstagram")
    .factory("databaseFactory", function ($http, FIREBASE_CONFIG) {

        return Object.create(null, {

            //firebase restAPI calls

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
                value: function (bandUID) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "GET",
                                url: `${FIREBASE_CONFIG.databaseURL}/bandTable/.json?auth=${idToken}&orderBy="uid"&equalTo="${bandUID}"`
                            }).then(response => {
                                return response.data
                            })
                        })
                }
            },
            "getFan": {
                value: function (userUID) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "GET",
                                url: `${FIREBASE_CONFIG.databaseURL}/fanTable/.json?auth=${idToken}&orderBy="uid"&equalTo="${userUID}"`
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
                    recordingInfo.timeStamp = Date.now()
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
            "editRecordingInfo": {
                value: function (fbID, recordingInfo) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "PATCH",
                                url: `${FIREBASE_CONFIG.databaseURL}/recordingTable/${fbID}/.json?auth=${idToken}`,
                                data: recordingInfo
                            })
                        }
                        )
                }
            },
            "deleteRecordingInfo": {
                value: function (recordingID) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "DELETE",
                                url: `${FIREBASE_CONFIG.databaseURL}/recordingTable/${recordingID}/.json?auth=${idToken}`,
                            })
                        }
                        )
                }
            },
            "vote": {
                value: function (vote) {
                    vote.timeStamp = Date.now()
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "POST",
                                url: `${FIREBASE_CONFIG.databaseURL}/voteTable/.json?auth=${idToken}`,
                                data: vote
                            })
                        }
                        )
                }
            },
            "getVotesByFan": {
                value: function (fanUID) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "GET",
                                url: `${FIREBASE_CONFIG.databaseURL}/voteTable/.json?auth=${idToken}&orderBy="fanUID"&equalTo="${fanUID}"`,
                            }).then(response => {
                                response = response.data
                                let dataArray =
                                    Object.keys(response)
                                        .map(key => {
                                            response[key].id = key
                                            return response[key]
                                        })

                                return dataArray
                            })
                        }
                        )
                }
            },
            "getAllVotes": {
                value: function () {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "GET",
                                url: `${FIREBASE_CONFIG.databaseURL}/voteTable/.json?auth=${idToken}`,
                            }).then(response => {
                                response = response.data
                                let dataArray =
                                    Object.keys(response)
                                        .map(key => {
                                            response[key].id = key
                                            return response[key]
                                        })

                                return dataArray
                            })
                        }
                        )
                }
            },
            "changeVote": {
                value: function (voteID, vote) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "PUT",
                                url: `${FIREBASE_CONFIG.databaseURL}/voteTable/${voteID}/vote/.json?auth=${idToken}`,
                                data: vote
                            })
                        }
                        )
                }
            },
            "deleteVote": {
                value: function (voteID) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "DELETE",
                                url: `${FIREBASE_CONFIG.databaseURL}/voteTable/${voteID}/.json?auth=${idToken}`,
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
                                data: { "bandUID": bandID, "fanUID": firebase.auth().currentUser.uid }
                            })
                        }
                    )
                }
            },
            "unfollowBand": {
                value: function (followUID) {
                    let fanUID = firebase.auth().currentUser.uid
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "DELETE",
                                url: `${FIREBASE_CONFIG.databaseURL}/followingTable/${followUID}/.json?auth=${idToken}`
                            })
                        }
                    )
                }
            },
            "getFollowingByFan": {
                value: function (fanUID) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "GET",
                                url: `${FIREBASE_CONFIG.databaseURL}/followingTable/.json?auth=${idToken}&orderBy="fanUID"&equalTo="${fanUID}"`
                            }).then(response => {
                                response = response.data
                                let dataArray =
                                    Object.keys(response)
                                        .map(key => {
                                            response[key].id = key
                                            return response[key]
                                        })

                                return dataArray
                            })
                        }
                    )
                }
            },
            "getFollowingByBand": {
                value: function (bandUID) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "GET",
                                url: `${FIREBASE_CONFIG.databaseURL}/followingTable/.json?auth=${idToken}&orderBy="bandUID"&equalTo="${bandUID}"`
                            }).then(response => {
                                return Object.keys(response.data).map(key => response.data[key].fanUID)
                            })
                        }
                    )
                }
            },
            "addToFavorites": {
                value: function (fanUID, recordingInfo) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "POST",
                                url: `${FIREBASE_CONFIG.databaseURL}/favoriteTable/${fanUID}/.json?auth=${idToken}`,
                                data: recordingInfo
                            })
                        }
                        )
                }
            },
            "getFavorites": {
                value: function (fanUID) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "GET",
                                url: `${FIREBASE_CONFIG.databaseURL}/favoriteTable/${fanUID}/.json?auth=${idToken}`
                            }).then(response => {
                                let dataArray = []
                                if (response.data) {
                                    response = response.data
                                    dataArray =
                                        Object.keys(response)
                                            .map(key => {
                                                response[key].id = key
                                                return response[key]
                                            })

                                }
                                return dataArray
                            })
                        }
                    )
                }
            },
            "removeFromFavorites": {
                value: function (currentUser, favoriteID) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "DELETE",
                                url: `${FIREBASE_CONFIG.databaseURL}/favoriteTable/${currentUser}/${favoriteID}/.json?auth=${idToken}`,
                            })
                        }
                    )
                }
            },
            "reorderFavorites": {
                value: function (favs) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "PATCH",
                                url: `${FIREBASE_CONFIG.databaseURL}/favoriteTable/.json?auth=${idToken}`,
                                data: favs
                            })
                        }
                    )
                }
            }
        })
    })
