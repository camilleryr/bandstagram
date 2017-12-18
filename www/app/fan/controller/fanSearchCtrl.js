angular.module('bandstagram')
.controller('fanSearchCtrl', function($scope, $state, databaseFactory, $timeout) {
    
    $scope.bandTable = []
    
    databaseFactory.getTable("bandTable").then(response => {
        $timeout(()=>console.log(),100)
        $scope.bandTable = response
    })


    $scope.showDetail = bandUID => $state.go('fan.search.details', {"bandUID" : ":" + bandUID})
    
    $scope.follow = bandUID => databaseFactory.followBand(bandUID)
})