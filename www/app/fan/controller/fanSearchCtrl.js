angular.module('bandstagram')
.controller('fanSearchCtrl', function($scope, $state, databaseFactory, $timeout, $q, $filter, $ionicListDelegate) {

    //get user from the firebase object    
    let currentUser = firebase.auth().currentUser.uid
    
    //initialize the soped variable
    $scope.bandTable = []
    
    //array of firebaseDB requests
    let requests = [databaseFactory.getTable("bandTable"), databaseFactory.getFollowingByFan(currentUser)]
    
    //once the array of promises is resolved, send results to the fan search filter, this adds a property to all of the bands to match the followed status - save the results to scope
    $q.all(requests).then(results => {
        $scope.bandTable = $filter('fanSearchFilter')(results[0],results[1])
    })
    
    //navigate to a new view to show the details of a band, send the uid and a boolean value of followed to the view with state paramaters
    $scope.showDetail = band => {
        $state.go('fan.search.details', {"bandUID" : ":" + band.uid, "followed" : ":" + band.followed})
    }
    
    //Follow a band - get the index of the band from the band table, set the followed property of the band in the band table to true, add an entry to the firebaseDB and the last line closes the slide over options
    $scope.follow = band => {
        let bandIndex = $scope.bandTable.map(x => x.id).indexOf(band.id)
        $scope.bandTable[bandIndex].followed = true
        databaseFactory.followBand(band.uid)
        $ionicListDelegate.closeOptionButtons()
    }
    
    //Unfollow a band - get the index of the band from the band table, set the followed property of the band in the band table to false, add an entry to the firebaseDB and the last line closes the slide over options
    $scope.unfollow = band => {
        let bandIndex = $scope.bandTable.map(x => x.id).indexOf(band.id)
        delete $scope.bandTable[bandIndex].followed
        databaseFactory.unfollowBand(band.followedID)
        $ionicListDelegate.closeOptionButtons()
    }
    
    //property for showing and hiding filtered results on the partial
    $scope.active = 'all';

    $scope.setActive = function(type) {
        $scope.active = type;
    };
    $scope.isActive = function(type) {
        return type === $scope.active;
    };
})