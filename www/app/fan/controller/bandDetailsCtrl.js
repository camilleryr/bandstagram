angular.module('bandstagram')
.controller('bandDetailsCtrl', function($scope, $state, databaseFactory, $stateParams, audioFactory) {

    // get the band id from the url via state paramaters, cut out the first character with the slice
    let bandUID = $stateParams.bandUID.slice(1)
    
    // get the followed status from the url via state paramaters, cut out the first character with the slice
    $scope.followed = $stateParams.followed.slice(1)
    
    // Pull band info from firebaseDB
    databaseFactory.getBand(bandUID).then(band => $scope.band=Object.values(band)[0])
    
    // Pull songs from the band from firebaseDB
    databaseFactory.getSongsByBand(bandUID).then(songs => $scope.songs = songs)
    
    // Play recording
    $scope.togglePlay = recordingURL => {
        audioFactory.togglePlay(recordingURL)
    }
    
    // Add entry to firebase followTable 
    $scope.followBand = () => databaseFactory.followBand(bandUID)
})
