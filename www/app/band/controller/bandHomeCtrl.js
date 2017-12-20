angular.module('bandstagram')
    .controller('bandHomeCtrl', function ($scope, $state, databaseFactory, $timeout, $filter, $q, $ionicActionSheet, dataService, $ionicPopup) {


        let bandId = firebase.auth().currentUser.uid

        databaseFactory.getBand(bandId)
            .then(band => {
                $timeout(function () { console.log() }, 100)
                $scope.bandInfo = Object.values(band)[0]
            })

        let requests = [databaseFactory.getSongsByBand(bandId), databaseFactory.getTable("voteTable")]

        $q.all(requests).then(results => {
            let songs = results[0]
            let votes = results[1]
            $scope.songs = $filter('bandHomeFilter')(songs, votes)
            console.log($scope.songs)
        })

        $scope.triggerActionSheet = function (song) {


            // Show the action sheet
            var showActionSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Edit' }
                ],

                destructiveText: 'Delete',
                titleText: `<h3>${song.songName}</h3>`,
                cancelText: 'Cancel',

                cancel: function () {
                    // add cancel code...
                },

                buttonClicked: function (index) {
                    if (index === 0) {
                        dataService.setRecordingObject(song)
                        $state.go('band.home.details')
                    }
                },

                destructiveButtonClicked: function () {

                        var confirmPopup = $ionicPopup.confirm({
                            title: 'Delete Recording',
                            template: 'Are you sure you want to delete this recording?'
                        });

                        confirmPopup.then(function (res) {
                            if (res) {
                                let $index = $scope.songs.map(function(e) { return e.id; }).indexOf(song.id)
                                $scope.songs[$index].hide = true
                                databaseFactory.deleteRecordingInfo(song.id)
                                showActionSheet.$scope.cancel()
                                console.log('You are sure');
                            } else {
                                console.log('You are not sure');
                            }
                        });
                    
                }
            });
        };
    })
