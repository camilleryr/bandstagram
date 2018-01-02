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
        
        //modal controls for the add recording page
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
        
        //angular pass throughs to the recording factory and controlls for the big ol recording button
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


