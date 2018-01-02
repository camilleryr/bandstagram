angular.module('bandstagram')
  .controller('fanHomeCtrl', function ($filter, $scope, $state, databaseFactory, audioFactory, $timeout, $q, dataService, $ionicPopup) {

    // get user info from firebase user object
    let currentUser = firebase.auth().currentUser.uid

    // get user info from firebaseDB based on user uid
    databaseFactory.getFan(currentUser).then(result => {
      $scope.$apply(function () {
        $scope.fanInfo = Object.values(result)[0]
      })
    })

    // intialize arrays
    let bandsFollowing
    let recordingTable
    let bandTable
    let voteTable

    // function to run data trough the filter whenever changes are made
    const filter = function () {
      $timeout(function () { console.log() }, 100)
      $scope.filteredRecordings = $filter('fanHomeFilter')(recordingTable, bandsFollowing, bandTable, voteTable, favoriteTable)
    }

    // list of firebaseDB requests
    let requests = [databaseFactory.getFollowingByFan(currentUser), databaseFactory.getTable('recordingTable'), databaseFactory.getTable('bandTable'), databaseFactory.getVotesByFan(currentUser), databaseFactory.getFavorites(currentUser)]

    // array of promises to send to the filter function, once returned set the favorite list to the data service to be retrieved from the favorite view
    $q.all(requests).then(function (results) {
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

    //function to add, edit or delete a vote for a particular song
    $scope.vote = (songID, vote) => {

      //initalize a variable to hold the add, edit or delete promise
      let votePromise = null

      //find the index of the song in the filteredRecordings array
      let index = $scope.filteredRecordings.map(function (recording) { return recording.id }).indexOf(songID)

      //if there is no vote propery on the song object - add a vote that equals the vote cast
      if (!$scope.filteredRecordings[index].hasOwnProperty('vote')) {
        $scope.filteredRecordings[index].vote = vote
        votePromise = databaseFactory.vote(
          {
            "fanUID": currentUser,
            "recordingID": $scope.filteredRecordings[index].id,
            "vote": vote
          }
        )

        //if there is a vote propery but it does not match the vote cast, we will change the vote value
      } else if ($scope.filteredRecordings[index].vote !== vote) {
        $scope.filteredRecordings[index].vote = vote
        let voteID = voteTable.find(vote => vote.recordingID === $scope.filteredRecordings[index].id).id
        votePromise = databaseFactory.changeVote(voteID, vote)

        //if there is a vote propery and it does match the vote cast, we will delete the vote entry
      } else {
        delete $scope.filteredRecordings[index].vote
        let voteID = voteTable.find(vote => vote.recordingID === $scope.filteredRecordings[index].id).id
        votePromise = databaseFactory.deleteVote(voteID)
      }

      //trigger the vote promise and when the promise is resolved, refetch the total vote table, and send all information through the filter function again
      votePromise.then(voted =>
        databaseFactory.getVotesByFan(currentUser).then(
          result => {
            voteTable = result
            filter()
          })
      )
    }

    //show a pop up to confirm unfollowing a band from the list view
    $scope.unfollowPopUp = function (song) {
      let confirmPopup = $ionicPopup.confirm({
        title: `Unfollow ${song.bandName}`,
        template: `Would you like to stop following ${song.bandName}`
      });

      confirmPopup.then(function (res) {

        //if the popup is confirmed, map a new array of bandUID's get the index of the the selected bands bandUID, splice out that object from the bandsFollowing array and pull the firebaseID from that object... whew
        if (res) {
          databaseFactory.unfollowBand(bandsFollowing.splice(bandsFollowing.map(x => x.bandUID).indexOf(song.bandUID), 1)[0].id)

          filter()

          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }
      })
    }

    //add/remove a song to the favorite list
    $scope.favorite = function (song) {
      //find the index of the appropriate object in the filteredRecordings array
      let index = $scope.filteredRecordings.map(x => x.id).indexOf(song.id)

      //if the song has already been favorited - remove the propery from the song object in the filteredRecordings array, find the firebaseID for the favorite entry and then remove that entry from the firebaseDB
      if (song.favorite) {
        delete $scope.filteredRecordings[index].favorite
        let favoriteID = favoriteTable.find(x => x.recordingID === song.id).id
        databaseFactory.removeFromFavorites(currentUser, favoriteID)

      //if the song has not already been favorited - create a object with the songID and set the position to a time stamp (will always put this highest on the favorite list), add the entry to the users favorite table in firebase and updeate the song object in the filteredRecordings array and the favoriteTable array, reset the fanFavorites in the dataService
      } else {
        let favoriteObj = {
          "recordingID": song.id,
          "position": Date.now()
        }
        
        databaseFactory.addToFavorites(currentUser, favoriteObj).then(
          result => {
            $scope.filteredRecordings[index].favoriteID = result.data.name
            $scope.filteredRecordings[index].favorite = favoriteObj.position
          }
        )
        favoriteTable.push(favoriteObj)
      }

      dataService.setFanFavorite($scope.filteredRecordings)
    }



  })