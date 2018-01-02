angular
    .module("bandstagram")
    .factory("facebookFactory", function ($http, $q, databaseFactory) {

        return Object.create(null, {

            //save facebook access token here
            "facebookAccessToken": { "value": null, "writable": true, "enumerable": true },

            //set the facebook access token
            "setFbToken": {
                "value": function (token) {
                    this.facebookAccessToken = token
                }, "writable": true, "enumerable": true
            },

            //get the facebook access token
            "getFbToken": {
                "value": function () {
                    return this.facebookAccessToken
                }, "writable": true, "enumerable": true
            },
            
            //call facebook graphAPI with access token, retreive the music pages liked by the user and compare with bandTable - add any matches
            "importFavorites": {
                "value": function () {
                    var config = { headers: { 'Authorization': `Bearer ${this.facebookAccessToken}` } }

                    let requests = [$http.get("https://graph.facebook.com/v2.11/me?fields=music", config), databaseFactory.getTable("bandTable")]

                    $q.all(requests).then(function (results) {
                        // debugger
                        let bandTable = results[1]
                        let userFavoriteArray = results[0].data.music.data.map(x => x.name)

                        let bandsToFollow = []

                        userFavoriteArray.forEach(band => {
                            let bandToFollow = bandTable.find(bT => band.toLowerCase() === bT.bandName.toLowerCase())

                            if (bandToFollow) {
                                bandsToFollow.push(bandToFollow)
                            }
                        })

                        if (bandsToFollow.length > 0) {
                            bandsToFollow.forEach(x => {
                                databaseFactory.followBand(x.uid)
                            })
                        }
                    })

                }, "writable": true, "enumerable": true
            },
        })
    })