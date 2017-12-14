angular.module('bandstagram')
    .controller('bandAddCtrl', function ($scope, $state, $cordovaCamera, $cordovaMedia, $ionicModal, $cordovaFile, databaseFactory) {

        // let refrenceUrls = {}

        $scope.srcImage = "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fcnet4.cbsistatic.com%2Ffly%2F893-fly%2Fbundles%2Fcnetcss%2Fimages%2Fplaceholder%2Fimage_placeholder.png&f=1"

        $scope.recordingInfo = {}

        $scope.imageUrl =

            $scope.takePicture = function () {


                let options =
                    {
                        quality: 50,
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        allowEdit: true,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 300,
                        targetHeight: 300,
                        popoverOptions: CameraPopoverOptions,
                        saveToPhotoAlbum: false
                    }

                $cordovaCamera.getPicture(options).then(function (imageData) {
                    $scope.srcImage = "data:image/jpeg;base64," + imageData;
                    
                    let storageRef = firebase.storage().ref();
                    let fileRef = storageRef.child(`images/${firebase.auth().currentUser.uid}${Date.now()}.jpeg`)

                    let uploadImageTask = fileRef.putString($scope.srcImage, 'data_url')

                    // Listen for state changes, errors, and completion of the upload.
                    uploadImageTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                        function (snapshot) {
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED: // or 'paused'
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING: // or 'running'
                                    console.log('Upload is running');
                                    break;
                            }
                        }, function (error) {

                            // A full list of error codes is available at
                            // https://firebase.google.com/docs/storage/web/handle-errors
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    // User doesn't have permission to access the object
                                    break;

                                case 'storage/canceled':
                                    // User canceled the upload
                                    break;

                                case 'storage/unknown':
                                    // Unknown error occurred, inspect error.serverResponse
                                    break;
                            }
                        }, function () {
                            // Upload completed successfully, now we can get the download URL
                            $scope.recordingInfo.imageURL = uploadImageTask.snapshot.downloadURL;
                            console.log($scope.recordingInfo.imageURL)
                            // })
                        });


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

        $scope.closeModal = function () {
            $scope.modal.hide();

        }

        $scope.post = function () {
            $scope.recordingInfo.bandUID = firebase.auth().currentUser.uid
            console.log(JSON.stringify($scope.recordingInfo))
            databaseFactory.postRecordingInfo($scope.recordingInfo)
        }

        $scope.recording = Object.create(null, {
            "recordingUID": { "value": "", "writable": true, "enumberable": true },

            "filePath": { "value": "cdvfile://localhost/temporary/", "writable": true, "enumberable": true },

            "recordingObj": { "value": {}, "writable": true, "enumberable": true },

            "start": {
                "value": function () {

                    this.recordingUID = firebase.auth().currentUser.uid + Date.now() + ".m4a"

                    this.recordingObj = $cordovaMedia.newMedia(this.filePath + this.recordingUID)

                    console.log(JSON.stringify(this.recordingObj))
                    this.recordingObj.startRecord();
                }
            },
            "stop": {
                "value": function () {
                    console.log(JSON.stringify(this.recordingObj))
                    this.recordingObj.stopRecord();
                    console.log(JSON.stringify(this.recordingObj))
                }
            },
            "play": {
                "value": function () {
                    this.recordingObj.play();
                }
            },

            "save": {
                "value": function () {

                    console.log("save")
                    
                    let storageRef = firebase.storage().ref();
                    
                    console.log(this.recordingUID)

                    let recordingRef = storageRef.child(`recordings/${this.recordingUID}`);

                    // console.log(JSON.stringify(recordingRef))

                    $cordovaFile.readAsDataURL(cordova.file.tempDirectory, this.recordingUID).then(
                        function (success) {
                            console.log("converted")

                            let uploadRecordingTask = recordingRef.putString(success, 'data_url')
                            
                            // console.log(JSON.stringify(uploadRecordingTask))
                            // Listen for state changes, errors, and completion of the upload.
                            uploadRecordingTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                                function (snapshot) {
                                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                    console.log('Upload is ' + progress + '% done');
                                    switch (snapshot.state) {
                                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                                            console.log('Upload is paused');
                                            break;
                                        case firebase.storage.TaskState.RUNNING: // or 'running'
                                            console.log('Upload is running');
                                            break;
                                    }
                                }, function (error) {

                                    // A full list of error codes is available at
                                    // https://firebase.google.com/docs/storage/web/handle-errors
                                    switch (error.code) {
                                        case 'storage/unauthorized':
                                            // User doesn't have permission to access the object
                                            break;

                                        case 'storage/canceled':
                                            // User canceled the upload
                                            break;

                                        case 'storage/unknown':
                                            // Unknown error occurred, inspect error.serverResponse
                                            break;
                                    }
                                }, function () {
                                    // Upload completed successfully, now we can get the download URL
                                    $scope.recordingInfo.recordingURL = uploadRecordingTask.snapshot.downloadURL;
                                    console.log($scope.recordingInfo.recordingURL)
                                    $scope.closeModal()

                                    // })
                                }
                            );
                        }
                    )
                }
            }
        })
    })


