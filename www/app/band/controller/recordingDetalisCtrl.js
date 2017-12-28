angular.module('bandstagram')
    .controller('recordingDetailsCtrl', function ($scope, $state, $ionicModal, audioFactory, databaseFactory,  photoFactory, dataService) {

        // let refrenceUrls = {}

        // $scope.placeholder = photoFactory.placeholder

        $scope.recordingInfo = dataService.getRecordingObject()

        $scope.takePicture = function(){
            photoFactory.takePhoto().then(result => {
                $scope.recordingInfo.imageURL = result
            })
        }
        

        $ionicModal.fromTemplateUrl('app/band/partial/addRecordingModal.html', {
            scope: $scope,
            animation: 'slide-in-left'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function () {
            $scope.modal.show();
        };

        $scope.save = function () {
            editRecordingInfo
        }

        $scope.closeModal = function () {
            $scope.modal.hide();

        }

        $scope.recording = Object.create(null, {
            "active": {
                "value": false, "writable": true, "enumerable": true
            },
            "toggle": {
                "value": function() {
                    if(this.active === true){
                        this.active = false
                        this.stop()
                    } else if (this.active === false) {
                        this.active = true
                        this.start()
                    }
                }
            },
            "start": {
                "value": () => audioFactory.start()
            },
            "stop": {
                "value": () => audioFactory.stop()
            },
            "play": {
                "value": () => audioFactory.reviewRecording()
            },
            "save": {
                "value": () => audioFactory.save().then(result => {
                    $scope.recordingInfo.recordingURL = result
                    $scope.closeModal()
                })
            },
            "post": {
                "value": () => {
                    $scope.recordingInfo.bandUID = firebase.auth().currentUser.uid
                    databaseFactory.editRecordingInfo($scope.recordingInfo.id, {
                        "imageURL" : $scope.recordingInfo.imageURL,
                        "recordingURL" : $scope.recordingInfo.recordingURL,
                        "songDescription" : $scope.recordingInfo.songDescription,
                        "songName" : $scope.recordingInfo.songName 
                    }).then(uploaded => $state.go('band.home'))
                }
            }
        })
    })


