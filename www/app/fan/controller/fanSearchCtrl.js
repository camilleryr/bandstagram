angular.module('bandstagram')
.controller('fanSearchCtrl', function($scope, $state, databaseFactory) {
    
    $scope.bandTable = []
    
    databaseFactory.getTable("bandTable").then(response => {
        $scope.bandTable = response
    })


    $scope.showDetail = bandUID => $state.go('fan.search.details', {"bandUID" : ":" + bandUID})
    
    $scope.follow = bandUID => databaseFactory.followBand(bandUID)
})