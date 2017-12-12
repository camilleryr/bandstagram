angular.module('bandstagram')
  .factory("mediaFactory", function ($cordovaCamera, $state, authFactory, $ionicPlatform) {
    
    let storageRef = firebase.storage().ref()

    return Object.create(null, {
      
      "takePicture": {
        "value": () => {
          var options = {
            quality: 60,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 200,
            targetHeight: 200,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
          correctOrientation:true
          };
          
          $cordovaCamera.getPicture(options)
        }
      },

      "savePicture": {
        "value": (imageData) => {

          let fileRef = storageRef.child("images/" + currentUserData.uid + Date.now() + ".jpeg");
          let uploadTask = fileRef.putString(imageData, 'data_url')
        }
      },

      // "startRecording": {
      //   "value": () => {
      //     let name = "cdvfile://localhost/temporary/" + Date.now() + ".m4a"
      //     let newRecording = $cordovaMedia.newMedia(name)

      //     // Record audio
      //     mediaRec.startRecord();
      //   }
      // },

      // "stopRecording": {
      //   "value": mediaObject => mediaObject.stopRecord()
      // },

      // "playAudio": {
      //   "value": {}
      // },

      // "stopAudio": {
      //   "value": {}
      // },

      // "saveRecording": {
      //   "value": {}
      // },

      "uploadWatch": {
        "value": () => {
          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
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
              var downloadURL = uploadTask.snapshot.downloadURL;
              console.log(downloadURL)
              // })
            });

        }, function(err) {
          // error
        }
      }
    })
  })



