angular.module('bandstagram')
  .factory("audioFactory", function ($cordovaMedia, $cordovaFile, $rootScope) {
    return Object.create(null, {
      "mediaURL": { "value": null, "writable": true, "enumerable": true },

      "mediaObject": { "value": { "src": false }  , "writable": true, "enumerable": true },

      "currentlyPlaying": { "value": false, "writable": true, "enumerable": true },

      "togglePlay": {
        "value": function (mediaURL) {
          this.mediaURL = mediaURL

          if (!this.currentlyPlaying && this.mediaURL === this.mediaObject.src) {
            this.playRecording()
          }else if (this.currentlyPlaying) {
            console.log("Stop")
            this.mediaObject.stop()
            this.currentlyPlaying = false
          }else if (this.mediaURL !== this.mediaObject.src) {
            this.playRecording()
          }
        }
      },
      
      "playRecording": {
        "value": function () {
          
          let onSuccess = () => {
            this.currentlyPlaying = false
          }

          let onError = (error) => {
            console.log(JSON.stringify(error))
          }


          console.log("Play")
          this.currentlyPlaying = true
          this.mediaObject = new Media(this.mediaURL, onSuccess, onError)
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
          $rootScope.show('<ion-spinner></ion-spinner>')

          let storageRef = firebase.storage().ref();

          console.log(this.recordingUID)

          let recordingRef = storageRef.child(`recordings/${this.recordingUID}`);

          console.log("success with storageref")

          return $cordovaFile.readAsDataURL(cordova.file.tempDirectory, this.recordingUID).then(
            function (success) {
              console.log("converted")

              return recordingRef.putString(success, 'data_url').then(result => {
                $rootScope.hide()
                return recordingRef.getDownloadURL()
              })
            }
          )
        }
      }
    })
  })



