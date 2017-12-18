angular.module('bandstagram')
  .controller('fanHomeCtrl', function ($filter, $scope, $state, databaseFactory, audioFactory, $timeout, $q) {
    
    let currentUser = firebase.auth().currentUser.uid

    databaseFactory.getFan(currentUser).then(result => {
      $scope.$apply(function(){
        $scope.fanInfo = Object.values(result)[0]
      })
    })

    let requests = [databaseFactory.getFollowing(currentUser), databaseFactory.getTable('recordingTable'), databaseFactory.getTable('bandTable')]

    $q.all(requests).then(function(results) {
      console.log(results)
      let bandsFollowing = results[0]
      let recordingTable = results[1]
      let bandTable = results[2]
      $scope.filteredRecordings = $filter('byBand')(recordingTable, bandsFollowing, bandTable)
    })

    $scope.togglePlay = recordingURL => {
      audioFactory.togglePlay(recordingURL)
    }



  })