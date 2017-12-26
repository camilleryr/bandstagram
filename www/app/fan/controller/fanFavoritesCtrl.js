angular.module('bandstagram')
.controller('fanFavoritesCtrl', function($scope, $state, databaseFactory, $timeout, dataService, audioFactory) {
    
    let fanUID = firebase.auth().currentUser.uid

    $scope.data = {
        "showReorder": true,
        "showDelete": false
    }

    $scope.favorites = dataService.getFanFavorite()

    $scope.togglePlay = function(recordingURL) {
        audioFactory.togglePlay(recordingURL)
    }

    $scope.moveItem = function(item, fromIndex, toIndex) {
        $scope.favorites.splice(fromIndex, 1);
        $scope.favorites.splice(toIndex, 0, item);
        
        let favObj = {}
        favObj[fanUID] = {}


        $scope.favorites.forEach((fav, index) => {
            favObj[fanUID][fav.favoriteID] = {"position":($scope.favorites.length - index), "recordingID":fav.id}
        })
        

        databaseFactory.reorderFavorites(favObj)
    }

    $scope.onItemDelete = function(favorite) {
        $scope.favorites.find(x => x.id === favorite.id).favorite = null
        databaseFactory.removeFromFavorites(fanUID, favorite.favoriteID)
    }
})