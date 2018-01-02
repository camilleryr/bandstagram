angular
    .module("bandstagram")
    .service('dataService', function () {
        return Object.create(null, {

            //pass information between controllers
            
            "recordingObject": { "value": {}, "writable": true, "enumerable": true },
            "setRecordingObject": {
                "value": function (recordingObj) {
                    this.recordingObject = recordingObj
                }, "enumerable": true
            },
            "getRecordingObject": {
                "value": function () {
                    return this.recordingObject
                }, "enumerable": true
            },
            
            "userInfo": { "value": {}, "writable": true, "enumerable": true },
            "setUserInfo" : {
                "value": function (userObj) {
                    this.userInfo = userObj
                }, "enumerable": true
            },
            "getUserInfo": {
                "value": function () {
                    return this.userInfo
                }, "enumerable": true
            },

            "fanFavorite": { "value": {}, "writable": true, "enumerable": true },
            "setFanFavorite" : {
                "value": function (filteredSongs) {
                    filteredSongs = filteredSongs.filter(x => {if(x.favorite){return x}})
                    filteredSongs = filteredSongs.sort((a, b) => b.favorite - a.favorite)
                    this.fanFavorite = filteredSongs
                }, "enumerable": true
            },
            "getFanFavorite": {
                "value": function () {
                    return this.fanFavorite
                }, "enumerable": true
            }
        })
    });