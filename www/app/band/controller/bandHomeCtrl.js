angular.module('bandstagram')
.controller('bandHomeCtrl', function($scope, $state, databaseFactory) {

    $scope.$on('$ionicView.beforeEnter', 
        function () {
            $scope.bandId = firebase.auth().currentUser.uid
        
            databaseFactory.getBand($scope.bandId)
                .then(band => $scope.bandInfo = band)
                .then(() => databaseFactory.getSongsByBand($scope.bandId))
                .then(songs => $scope.songs = songs)
                .then(() => {console.log($scope.bandId); console.log($scope.bandInfo); console.log($scope.songs)})

        })

})