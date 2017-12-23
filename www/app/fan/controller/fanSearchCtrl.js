angular.module('bandstagram')
.controller('fanSearchCtrl', function($scope, $state, databaseFactory, $timeout, $q, $filter, $ionicListDelegate) {
    
    let currentUser = firebase.auth().currentUser.uid
    
    $scope.bandTable = []
    
    let requests = [databaseFactory.getTable("bandTable"), databaseFactory.getFollowingByFan(currentUser)]

    $q.all(requests).then(results => {
        $scope.bandTable = $filter('fanSearchFilter')(results[0],results[1])
    })

    $scope.showDetail = band => $state.go('fan.search.details', {"bandUID" : ":" + band.uid, "favorite" : ":" + band.favorite})
    
    $scope.follow = band => {
        let bandIndex = $scope.bandTable.map(x => x.id).indexOf(band.id)
        $scope.bandTable[bandIndex].followed = true
        databaseFactory.followBand(band.uid)
        $ionicListDelegate.closeOptionButtons()
    }
    
    $scope.unfollow = band => {
        let bandIndex = $scope.bandTable.map(x => x.id).indexOf(band.id)
        delete $scope.bandTable[bandIndex].followed
        databaseFactory.unfollowBand(band.followedID)
        $ionicListDelegate.closeOptionButtons()
    }
    
    $scope.active = 'all';

    $scope.setActive = function(type) {
        $scope.active = type;
    };
    $scope.isActive = function(type) {
        return type === $scope.active;
    };
})