angular.module('bandstagram')
.filter('byBand', function() {
    return function(recordings, bandArray) {
      var out = [];
      //user.name
      angular.forEach(recordings, function(recording) {
        if (bandArray.indexOf(recording.bandUID) > -1) {
          out.push(recording);
        }
      });
      return out;
    };
  })

.controller('fanHomeCtrl', function($filter, $scope, $state, databaseFactory, mediaFactory) {
    
    $scope.$on('$ionicView.beforeEnter', 
        function () {
            databaseFactory.getFollowing(firebase.auth().currentUser.uid)
                .then(function(response) {$scope.bandsFollowing = response})
                .then(() => databaseFactory.getTable("recordingTable"))
                .then(function(response) {$scope.recordingTable = response})
                .then(() => {$scope.filteredRecordings = $filter('byBand')($scope.recordingTable, $scope.bandsFollowing); console.log($scope.filteredRecordings)})

                $scope.togglePlay = index => {
                    mediaFactory.togglePlay($scope.filteredRecordings[index].recordingURL)
                }
    })

    
})