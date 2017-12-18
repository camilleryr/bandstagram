angular.module('bandstagram')
    .controller('bandAddCtrl', function ($scope, $state, $ionicModal, audioFactory, databaseFactory, $cordovaCamera, $cordovaFile, $cordovaMedia, photoFactory) {

        // let refrenceUrls = {}

        $scope.srcImage = "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fcnet4.cbsistatic.com%2Ffly%2F893-fly%2Fbundles%2Fcnetcss%2Fimages%2Fplaceholder%2Fimage_placeholder.png&f=1"

        $scope.recordingInfo = {}

        $scope.takePicture = function(){
            photoFactory.takePhoto($scope).then(result => {
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
                    databaseFactory.postRecordingInfo($scope.recordingInfo).then(
                        $state.go('band.home', {}, { reload: true })
                    )
                }
            }
        })
    })


