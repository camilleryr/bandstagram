angular.module('bandstagram')
    .controller('bandAddCtrl', function ($scope, $state, mediaFactory, $cordovaCamera, $cordovaMedia, $ionicModal) {
        $scope.srcImage = "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fcnet4.cbsistatic.com%2Ffly%2F893-fly%2Fbundles%2Fcnetcss%2Fimages%2Fplaceholder%2Fimage_placeholder.png&f=1"
        $scope.recordingInfo = {}

        $scope.takePicture = function () {

            $cordovaCamera.getPicture(mediaFactory.photoOptions).then(function (imageData) {
                $scope.srcImage = "data:image/jpeg;base64," + imageData;
            }, function (err) {
                // error
            });
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

        $scope.closeModal = function (bool) {
            $scope.modal.hide();

        }

        $scope.recording = function(){
            let recordingObj
            let name
            return Object.create(null, {
                "start" : {
                    "value" : function () {
                        console.log("test")
                        name = "cdvfile://localhost/temporary/" + Date.now() + ".m4a"
                        recordingObj = $cordovaMedia.newMedia(name)

                        recordingObj.startRecord();
                    }
                },
                "stop" : {
                    "value" : function () {
                        recordingObj.startRecord();
                    }
                },
                "play" : {
                    "value" : function () {
                        recordingObj.play();
                    }
                },
            })
        }


    })