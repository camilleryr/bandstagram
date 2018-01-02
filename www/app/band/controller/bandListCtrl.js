angular.module('bandstagram')
    .controller('bandListCtrl', function ($scope, $state, databaseFactory, $timeout, $filter, $q, $ionicActionSheet, dataService, $ionicPopup) {


        let bandId = firebase.auth().currentUser.uid

        //pull user info from dataService - saved from the home controller
        $scope.bandInfo = dataService.getUserInfo()

        //array of promises fro the bandListFilter - adds all vote info to the song objects
        let requests = [databaseFactory.getSongsByBand(bandId), databaseFactory.getTable("voteTable")]

        $q.all(requests).then(results => {
            let songs = results[0]
            let votes = results[1]
            $scope.songs = $filter('bandListFilter')(songs, votes)
            console.log($scope.songs)
        })

        //open up an affordance when a song is selected with edit and delete options
        $scope.triggerActionSheet = function (song) {

            var showActionSheet = $ionicActionSheet.show({
                buttons: [
                    { text: '<p class ="calm">Edit</p>' }
                ],

                destructiveText: 'Delete',
                titleText: `<h3 class="dark">${song.songName}</h3>`,
                cancelText: '<p class="dark">Cancel</p>',

                cancel: function () {
                    // this already closes the action sheet, I dont think it needs to do anything else
                },

                buttonClicked: function (index) {
                    // this is for the edit button, it takes you to the song detail pate
                    if (index === 0) {
                        // save the song object to the data service so that it can be accessed from the edit page
                        dataService.setRecordingObject(song)
                        $state.go('band.list.details')
                    }
                },

                // for when you click the delte button
                destructiveButtonClicked: function () {
                    
                    // open a confirmation popup
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Delete Recording',
                        template: 'Are you sure you want to delete this recording?'
                    });
                    
                    // if confirmed...
                    confirmPopup.then(function (res) {
                        if (res) {
                            // find the index of the song in the songs array
                            let $index = $scope.songs.map(function (e) { return e.id; }).indexOf(song.id)
                            // add a property of hide
                            $scope.songs[$index].hide = true
                            // remove it from firebaseDB
                            databaseFactory.deleteRecordingInfo(song.id)
                            // close action sheed
                            showActionSheet.$scope.cancel()
                        } else {
                            console.log('You are not sure');
                        }
                    });

                }
            });
        };
    })
