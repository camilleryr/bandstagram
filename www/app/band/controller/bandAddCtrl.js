angular.module('bandstagram')
    .controller('bandAddCtrl', function ($scope, $state, $ionicModal, audioFactory, databaseFactory,photoFactory) {

        // let refrenceUrls = {}

        $scope.placeholder = photoFactory.placeholder

        $scope.recordingInfo = {}

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

        $scope.closeModal = function () {
            $scope.modal.hide();

        }

        $scope.recording = Object.create(null, {
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
                    console.log(result)
                    $scope.recordingInfo.recordingURL = result
                    $scope.closeModal()
                })
            },
            "post": {
                "value": () => {
                    $scope.recordingInfo.bandUID = firebase.auth().currentUser.uid
                    console.log(JSON.stringify($scope.recordingInfo))
                    databaseFactory.postRecordingInfo($scope.recordingInfo).then(result =>
                        $state.go('band.home')
                    )
                }
            }
        })
    })


