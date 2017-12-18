angular.module('bandstagram')
    .controller('bandHomeCtrl', function ($scope, $state, databaseFactory, $timeout) {


        let bandId = firebase.auth().currentUser.uid

        databaseFactory.getBand(bandId)
            .then(band => {
                $timeout(function(){console.log()},100)
                $scope.bandInfo = Object.values(band)[0]
            })
            
        databaseFactory.getSongsByBand(bandId)
            .then(songs => {
                $timeout(function(){console.log()},100)
                $scope.songs = songs
            })
            
    })