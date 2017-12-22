angular.module('bandstagram')
  .controller('fanHomeCtrl', function ($filter, $scope, $state, databaseFactory, audioFactory, $timeout, $q, dataService) {

    let currentUser = firebase.auth().currentUser.uid

    databaseFactory.getFan(currentUser).then(result => {
      $scope.$apply(function () {
        $scope.fanInfo = Object.values(result)[0]
      })
    })
    
    let bandsFollowing
    let recordingTable
    let bandTable
    let voteTable
    
    const filter = function () {
      $timeout(function () { console.log() }, 100)
      $scope.filteredRecordings = $filter('fanHomeFilter')(recordingTable, bandsFollowing, bandTable, voteTable, favoriteTable)
      console.log($scope.filteredRecordings)
    }

    let requests = [databaseFactory.getFollowingByFan(currentUser), databaseFactory.getTable('recordingTable'), databaseFactory.getTable('bandTable'), databaseFactory.getVotesByFan(currentUser), databaseFactory.getFavorites(currentUser)]
    
    $q.all(requests).then(function (results) {
      console.log(results)
      bandsFollowing = results[0]
      recordingTable = results[1]
      bandTable = results[2]
      voteTable = results[3]
      favoriteTable = results[4]
      filter()
      dataService.setFanFavorite($scope.filteredRecordings)
    })

    $scope.togglePlay = recordingURL => {
      audioFactory.togglePlay(recordingURL)
    }

    $scope.vote = (songID, vote) => {
      let votePromise = null
      let index = $scope.filteredRecordings.map(function(recording) { return recording.id }).indexOf(songID)

      if (!$scope.filteredRecordings[index].hasOwnProperty('vote')) {
        $scope.filteredRecordings[index].vote = vote
        votePromise = databaseFactory.vote(
          {
            "fanUID": currentUser,
            "recordingID": $scope.filteredRecordings[index].id,
            "vote": vote
          }
        )

      } else if ($scope.filteredRecordings[index].vote !== vote) {
        $scope.filteredRecordings[index].vote = vote
        let voteID = voteTable.find(vote => vote.recordingID === $scope.filteredRecordings[index].id).id
        votePromise = databaseFactory.changeVote(voteID, vote)

      } else {
        delete $scope.filteredRecordings[index].vote
        let voteID = voteTable.find(vote => vote.recordingID === $scope.filteredRecordings[index].id).id
        votePromise = databaseFactory.deleteVote(voteID)
      }

      votePromise.then(voted =>
        databaseFactory.getVotesByFan(currentUser).then(
          result => {
            voteTable = result
            filter()
          })
      )
    }

    $scope.favorite = function(song) {
      let index = $scope.filteredRecordings.map(x => x.id).indexOf(song.id)

      if(song.favorite){
        delete $scope.filteredRecordings[index].favorite
        let favoriteID = favoriteTable.find(x => x.recordingID === song.id).id
        databaseFactory.removeFromFavorites(currentUser, favoriteID)

      } else {
        let favoriteObj = {
          "recordingID" : song.id,
          "position" : Date.now()
        }
        $scope.filteredRecordings[index].favorite = favoriteTable.length + 1

        databaseFactory.addToFavorites(currentUser, favoriteObj).then(
          result => {
            $scope.filteredRecordings[index].favoriteID = result.data.name 
          }
        )
        favoriteTable.push(favoriteObj)
      }

      dataService.setFanFavorite($scope.filteredRecordings)
    }



  })