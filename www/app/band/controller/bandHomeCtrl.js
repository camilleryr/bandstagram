angular.module('bandstagram')
    .controller('bandHomeCtrl', function ($scope, $state, databaseFactory, $timeout) {


        $scope.bandId = firebase.auth().currentUser.uid

        databaseFactory.getBand($scope.bandId)
            .then(band => {
                $timeout(function(){console.log()},100)
                $scope.bandInfo = band
            })
            
        databaseFactory.getSongsByBand($scope.bandId)
            .then(songs => {
                $timeout(function(){console.log()},100)
                $scope.songs = songs
            })
            
    })