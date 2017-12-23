angular.module('bandstagram')
.controller('bandDetailsCtrl', function($scope, $state, databaseFactory, $stateParams, audioFactory) {

    let bandUID = $stateParams.bandUID.slice(1)
    $scope.favorite = $stateParams.favorite.slice(1)

    console.log($scope.favorite)

    databaseFactory.getBand(bandUID).then(band => $scope.band=Object.values(band)[0])
    databaseFactory.getSongsByBand(bandUID).then(songs => $scope.songs = songs)



    $scope.togglePlay = recordingURL => {
        audioFactory.togglePlay(recordingURL)
    }

    $scope.followBand = () => databaseFactory.followBand(bandUID)
})
