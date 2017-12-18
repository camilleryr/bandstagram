angular.module('bandstagram')
  .filter('byBand', function () {
    return function (recordings, bandArray) {
      var out = [];
      //user.name
      angular.forEach(recordings, function (recording) {
        if (bandArray.indexOf(recording.bandUID) > -1) {
          out.push(recording);
        }
      });
      return out;
    };
  })

  .controller('fanHomeCtrl', function ($filter, $scope, $state, databaseFactory, audioFactory, $timeout, $q) {
    
    let currentUser = firebase.auth().currentUser.uid

    $scope.requests = [databaseFactory.getFollowing(currentUser), databaseFactory.getTable('recordingTable')]


    $q.all($scope.requests).then(function(results) {
      console.log(results)
      $scope.bandsFollowing = results[0]
      $scope.recordingTable = results[1]
      $scope.filteredRecordings = $filter('byBand')($scope.recordingTable, $scope.bandsFollowing)
    })

    $scope.togglePlay = index => {
      audioFactory.togglePlay($scope.filteredRecordings[index].recordingURL)
    }



  })