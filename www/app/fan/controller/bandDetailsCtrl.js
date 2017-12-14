angular.module('bandstagram')
.controller('bandDetailsCtrl', function($scope, $state, databaseFactory, $stateParams, mediaFactory) {

    let bandUID = $stateParams.bandUID.slice(1)

    databaseFactory.getBand(bandUID).then(band => $scope.band=Object.values(band)[0])
    databaseFactory.getSongsByBand(bandUID).then(songs => $scope.songs = songs)



    $scope.togglePlay = index => {
        console.log($scope.band)
        console.log($scope.songs[index].recordingURL)
        mediaFactory.togglePlay($scope.songs[index].recordingURL)
    }

    $scope.followBand = () => databaseFactory.followBand(bandUID)
})
