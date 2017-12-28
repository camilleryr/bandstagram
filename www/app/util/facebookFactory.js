angular
    .module("bandstagram")
    .factory("facebookFactory", function ($http, $q, databaseFactory) {

        return Object.create(null, {
            "facebookAccessToken" : {"value" : null, "writable": true, "enumerable": true},

            "setFbToken" : {
                "value" : function(token){
                    this.facebookAccessToken = token
                }, "writable": true, "enumerable": true},

            "getFbToken" : {
                "value" : function(){
                    return this.facebookAccessToken
                }, "writable": true, "enumerable": true},

            "importFavorites" : {
                "value" : function(){
                    var config = {headers:  {'Authorization': `Bearer ${this.facebookAccessToken}`}}
                    
                    let requests = [$http.get("https://graph.facebook.com/v2.11/me?fields=music", config), databaseFactory.getTable("bandTable")]

                    $q.all(requests).then(function(results){
                        // debugger
                        let bandTable = results[1]
                        let userFavoriteArray = results[0].data.music.data.map(x => x.name)

                        let bandsToFollow = []

                        userFavoriteArray.forEach(band => {
                            let bandToFollow = bandTable.find( bT => band.toLowerCase() === bT.bandName.toLowerCase())
                            
                            if(bandToFollow){
                                bandsToFollow.push(bandToFollow)
                            }
                        })
                        
                        if(bandsToFollow.length > 0){
                            bandsToFollow.forEach(x => {
                                databaseFactory.followBand(x.uid)
                            })
                        }
                    })
                    
                }, "writable": true, "enumerable": true},
        })
    })