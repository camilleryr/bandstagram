angular.module('bandstagram')
.controller('bandDetailsCtrl', function($scope, $state, databaseFactory, $stateParams, mediaFactory) {

    let bandFBID = $stateParams.bandFBID.slice(1)

    databaseFactory.getBand(bandFBID)
        .then(band => $scope.band = band)
        .then(() => databaseFactory.getSongsByBand($scope.band.uid))
        .then(songs => $scope.songs = songs)

    $scope.togglePlay = index => {
        console.log($scope.songs[index].recordingURL)
        mediaFactory.togglePlay($scope.songs[index].recordingURL)
    }

    $scope.followBand = () => databaseFactory.followBand($scope.band.uid)
})
