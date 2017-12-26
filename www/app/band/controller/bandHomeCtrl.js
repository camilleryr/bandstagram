angular.module('bandstagram')
    .controller('bandHomeCtrl', function ($scope, $state, databaseFactory, $timeout, $filter, $q, $ionicActionSheet, dataService, $ionicPopup) {


        let bandId = firebase.auth().currentUser.uid

        databaseFactory.getBand(bandId)
            .then(band => {
                $timeout(function () { console.log() }, 100)
                dataService.setUserInfo(Object.values(band)[0])
                $scope.bandInfo = dataService.getUserInfo()
            })

        databaseFactory.getFollowingByBand(bandId)
            .then(result => {
                $scope.followers = result
            })

        let requests = [databaseFactory.getSongsByBand(bandId), databaseFactory.getAllVotes()]
        
        $q.all(requests).then(results => {
            $scope.recordings = results[0]
            $scope.votes = $filter("bandVotes")(results[0], results[1])
            try{
                $scope.voteTotal = $scope.votes.map(a => a.vote).reduce((b,c) => b + c)
            } catch (e) {
                $scope.voteTotal = 0
            }

        })

    })

    //dispay number of followers -> display list of followers
    //display the number of posts -> list of posts
    //display overall ranking? / vote count
    //display top performing post