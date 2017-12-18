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
          this.mediaObject.play();
        }
      },

      "recordingUID": { "value": "", "writable": true, "enumberable": true },

      "filePath": { "value": "cdvfile://localhost/temporary/", "writable": true, "enumberable": true },

      "recordingObj": { "value": {}, "writable": true, "enumberable": true },

      "reviewRecording": {
        "value": function () {
          if(!this.currentlyPlaying){
            this.currentlyPlaying = true
            this.recordingObj.play()
          } else {
            this.currentlyPlaying = false
            this.recordingObj.stop()
          }
        }
      },
      
      "start": {
        "value": function() {

          this.currentlyPlaying = false

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
        "value": function () {

          console.log("save")

          let storageRef = firebase.storage().ref();

          console.log(this.recordingUID)

          let recordingRef = storageRef.child(`recordings/${this.recordingUID}`);

          console.log("success with storageref")

          return $cordovaFile.readAsDataURL(cordova.file.tempDirectory, this.recordingUID).then(
            function (success) {
              console.log("converted")

              return recordingRef.putString(success, 'data_url').then(result => {
                return recordingRef.getDownloadURL()
              })
            }
          )
        }
      }
    })
  })



