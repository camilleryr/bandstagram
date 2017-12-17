angular.module('bandstagram')
.factory("photoFactory", function ($cordovaCamera) {
    return Object.create(null, {
        "takePhoto" : { 
            "value": ($scope) => {

            this.$scope = $scope

            let options =
                {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,

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
        }
    })
})