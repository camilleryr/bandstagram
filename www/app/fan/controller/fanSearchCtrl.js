angular.module('bandstagram')
.controller('fanSearchCtrl', function($scope, $state, databaseFactory) {
    
    databaseFactory.getTable("bandTable").then(response => {
        $scope.bandTable = response
    })

    $scope.bandTable = []

    $scope.showDetail = bandFBID => $state.go('fan.search.details', {"bandFBID" : ":" + bandFBID})
    
    $scope.follow = bandUID => databaseFactory.followBand(bandUID)
})