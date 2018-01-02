angular.module('bandstagram')
    .controller('bandHomeCtrl', function ($scope, $state, databaseFactory, $timeout, $filter, $q, $ionicActionSheet, dataService, $ionicPopup) {


        let bandId = firebase.auth().currentUser.uid

        //pull band info from firebaseDB and save it to the dataService so that it can be accessed in other scopes
        databaseFactory.getBand(bandId)
        .then(band => {
            $timeout(function () { console.log() }, 100)
            dataService.setUserInfo(Object.values(band)[0])
            $scope.bandInfo = dataService.getUserInfo()
        })
        
        //pull all matching results from the following table to generate stats
        databaseFactory.getFollowingByBand(bandId)
        .then(result => {
            $scope.followers = result
        })
        
        //list of DB requests for the filter
        let requests = [databaseFactory.getSongsByBand(bandId), databaseFactory.getAllVotes()]
        
        //array of promises that is then sent to the bandVote filter - this tabulates the total votes cast for the band and the total sum of those votes
        $q.all(requests).then(results => {
            $scope.recordings = results[0]
            $scope.votes = $filter("bandVotes")(results[0], results[1])

            //if votes is an empty array, set the voteTotal to 0, else set it to the sum of all votes
            try{
                $scope.voteTotal = $scope.votes.map(a => a.vote).reduce((b,c) => b + c)
            } catch (e) {
                $scope.voteTotal = 0
            }

        })

    })
