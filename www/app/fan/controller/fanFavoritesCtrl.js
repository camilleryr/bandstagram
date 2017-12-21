angular.module('bandstagram')
.controller('fanFavoritesCtrl', function($scope, $state, databaseFactory, $timeout, dataService) {
    
    let fanUID = firebase.auth().currentUser.uid

    $scope.favorites = dataService.getFanFavorite()
    console.log($scope.favorites)

    $scope.moveItem = function(item, fromIndex, toIndex) {
        console.log( $scope.favorites)
        $scope.favorites.splice(fromIndex, 1);
        $scope.favorites.splice(toIndex, 0, item);
        
        let favObj = {}
        favObj[fanUID] = {}


        $scope.favorites.forEach((fav, index) => {
            favObj[fanUID][fav.favoriteID] = {"position":($scope.favorites.length - index + 1), "recordingID":fav.id}
        })
        
        console.log(favObj)

        databaseFactory.reorderFavorites(favObj)
    }
})