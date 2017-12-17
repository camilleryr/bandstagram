angular.module('bandstagram')
  .factory("audioFactory", function ($cordovaMedia, $cordovaFile) {
    return Object.create(null, {
      "mediaURL": { "value": null, "writable": true, "enumerable": true },

      "mediaObject": { "value": { "media": { "src": false } }, "writable": true, "enumerable": true },

      "currentlyPlaying": { "value": false, "writable": true, "enumerable": true },

      "togglePlay": {
        "value": function (mediaURL) {
          this.mediaURL = mediaURL

          if (!this.currentlyPlaying && this.mediaURL === this.mediaObject.media.src) {
            this.playRecording()
          }

          if (this.currentlyPlaying) {
            console.log("Stop")
            this.mediaObject.stop()
            this.currentlyPlaying = false
          }

          if (this.mediaURL !== this.mediaObject.media.src) {
            this.playRecording()
          }
        }
      },

      "playRecording": {
        "value": function () {
          console.log("Play")
          this.currentlyPlaying = true
          this.mediaObject = $cordovaMedia.newMedia(this.mediaURL)
          console.log(JSON.stringify(this.mediaObject))
          this.mediaObject.play();
        }
      },

      "recordingUID": { "value": "", "writable": true, "enumberable": true },

      "filePath": { "value": "cdvfile://localhost/temporary/", "writable": true, "enumberable": true },

      "recordingObj": { "value": {}, "writable": true, "enumberable": true },

      "reviewRecording": {
        "value": function () {
          console.log("src")
          console.log(this.recordingObj.media.src)
          this.togglePlay(this.recordingObj.media.src)
        }
      },
      
      "start": {
        "value": function() {

          this.recordingUID = firebase.auth().currentUser.uid + Date.now() + ".m4a"

          this.recordingObj = $cordovaMedia.newMedia(this.filePath + this.recordingUID)
          console.log(JSON.stringify(this))

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

      "save": {
        "value": function ($scope) {

          console.log("save")

          let storageRef = firebase.storage().ref();

          console.log(this.recordingUID)

          let recordingRef = storageRef.child(`recordings/${this.recordingUID}`);

          console.log("success with storageref")

          $cordovaFile.readAsDataURL(cordova.file.tempDirectory, this.recordingUID).then(
            function (success) {
              console.log("converted")

              let uploadRecordingTask = recordingRef.putString(success, 'data_url')

              // console.log(JSON.stringify(uploadRecordingTask))
              // Listen for state changes, errors, and completion of the upload.
              return uploadRecordingTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
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
                  $scope.recordingInfo.recordingURL = uploadRecordingTask.snapshot.downloadURL
                  $scope.closeModal()

                }
              )
            }
          )
        }
      }
    })
  })



