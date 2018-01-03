angular.module('bandstagram')
.controller('fanFavoritesCtrl', function($scope, $state, databaseFactory, $timeout, dataService, audioFactory) {
    
    // get user info from firebase user obj
    let fanUID = firebase.auth().currentUser.uid
    
    // show the reorder icons or the delete icons
    $scope.data = {
        "showReorder": true,
        "showDelete": false
    }
    
    // retreive the favorite list from the data service
    $scope.favorites = dataService.getFanFavorite()
    
    // play or stop a single track
    $scope.togglePlay = function(recordingURL) {
        audioFactory.togglePlay(recordingURL)
    }
    
    // after items have been reordered...
    $scope.moveItem = function(item, fromIndex, toIndex) {
        // remove the song from the array
        $scope.favorites.splice(fromIndex, 1);
        // add it back to the array in the correct place
        $scope.favorites.splice(toIndex, 0, item);
        
        // initialize a blank object
        let favObj = {}
        // add a property to the object that is the fan's uid, and set its value to a blank object
        favObj[fanUID] = {}
        
        
        // rebuild the firebase table for the users favorite table by going through each favorited track and adding it as a key/value to the favObj with a property of position that matches its current position in the list
        $scope.favorites.forEach((fav, index) => {
            favObj[fanUID][fav.favoriteID] = {"position":($scope.favorites.length - index), "recordingID":fav.id}
        })
        
        
        // overwrite the whole table
        databaseFactory.reorderFavorites(favObj)
    }
    
    // delete an object from the favorite list and table
    $scope.onItemDelete = function(favorite) {
        $scope.favorites.find(x => x.id === favorite.id).favorite = null
        $scope.favorites.splice($scope.favorites.map(x => x.id).indexOf(favorite.id),1)
        databaseFactory.removeFromFavorites(fanUID, favorite.favoriteID)
    }
    
    // play all tracks in the favorite playlist
    $scope.playAll = function(index) {
        audioFactory.playAll($scope.favorites, index)
    }
    // go back one song in playlist
    $scope.playAllPrevious = function() {
        audioFactory.playAllPrevious()
    }
    // skip to next song in playlist
    $scope.playAllNext = function() {
        audioFactory.playAllNext()
    }
    // stop playing playlist
    $scope.playAllStop = function() {
        audioFactory.playAllStop()
    }
})