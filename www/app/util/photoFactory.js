angular.module('bandstagram')
    .factory("photoFactory", function ($cordovaCamera) {
        return Object.create(null, {
            "takePhoto": {
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

                    return $cordovaCamera.getPicture(options).then(function (imageData) {
                        imageData = "data:image/jpeg;base64," + imageData;

                        let storageRef = firebase.storage().ref();
                        let fileRef = storageRef.child(`images/${firebase.auth().currentUser.uid}${Date.now()}.jpeg`)
                        console.log("1")
                        
                        return fileRef.putString(imageData, 'data_url').then(result => {
                            console.log("2")
                            return fileRef.getDownloadURL()
                        })
                    })
                }
            }
        })
    })