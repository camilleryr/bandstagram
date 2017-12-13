angular.module('bandstagram')
    .controller('bandAddCtrl', function ($scope, $state, $cordovaCamera, $cordovaMedia, $cordovaFile,$ionicModal) {
        $scope.srcImage = "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fcnet4.cbsistatic.com%2Ffly%2F893-fly%2Fbundles%2Fcnetcss%2Fimages%2Fplaceholder%2Fimage_placeholder.png&f=1"
        $scope.recordingInfo = {}

        $scope.takePicture = function () {
            let options = 
            {
                quality: 80,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 250,
                targetHeight: 250,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
              }

            $cordovaCamera.getPicture(options).then(function (imageData) {
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

        $scope.recording = Object.create(null, {
                "name" : {"value": "", "writable": true, "enumberable": true},

                "recordingObj" : {"value": {}, "writable": true, "enumberable": true},

                "start" : {
                    "value" : function () {
                        this.name = "cdvfile://localhost/temporary/" + Date.now() + ".m4a"
                        this.recordingObj = $cordovaMedia.newMedia(name)
                        
                        console.log(JSON.stringify(this.recordingObj))
                        this.recordingObj.startRecord();
                    }
                },
                "stop" : {
                    "value" : function () {
                        console.log(JSON.stringify(this.recordingObj))
                        this.recordingObj.stopRecord();
                        console.log(JSON.stringify(this.recordingObj))
                    }
                },
                "play" : {
                    "value" : function () {
                        this.recordingObj.play();
                    }
                },
            })
        })


