angular.module('bandstagram')
    .factory("photoFactory", function ($cordovaCamera) {
        return Object.create(null, {
            "placeholder" : {
                "value" : "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fcnet4.cbsistatic.com%2Ffly%2F893-fly%2Fbundles%2Fcnetcss%2Fimages%2Fplaceholder%2Fimage_placeholder.png&f=1", "enumerable": true
            },

            "takePhoto": {
                "value": () => {

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
                        
                        return fileRef.putString(imageData, 'data_url').then(result => {
                            return fileRef.getDownloadURL()
                        })
                    })
                }
            }
        })
    })