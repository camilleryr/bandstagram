angular.module('bandstagram')
    .controller('bandHomeCtrl', function ($scope, $state, databaseFactory, $timeout, $filter, $q) {


        let bandId = firebase.auth().currentUser.uid

        databaseFactory.getBand(bandId)
            .then(band => {
                $timeout(function(){console.log()},100)
                $scope.bandInfo = Object.values(band)[0]
            })
        
        let requests = [databaseFactory.getSongsByBand(bandId), databaseFactory.getTable("voteTable")]

        $q.all(requests).then(results => {
            let songs = results[0]
            let votes = results[1]
            $scope.songs = $filter('bandHomeFilter')(songs, votes)
            console.log($scope.songs)
        })    
    })