angular.module('bandstagram')
  .factory("audioFactory", function ($cordovaMedia, $cordovaFile, $rootScope) {
    return Object.create(null, {

      //oh man, lots of stuff that kind of does some simmilar things, but used in different places and I didnt want to break anything by trying to make anything more universal...

      //save the url of a file here to use to verify if the request matches the current file
      "mediaURL": { "value": null, "writable": true, "enumerable": true },

      //save the media object here to play / stop when needed
      "mediaObject": { "value": { "src": false }, "writable": true, "enumerable": true },
      
      //boolian value to reflect if there is something playing
      "currentlyPlaying": { "value": false, "writable": true, "enumerable": true },
      
      //use one button to play and stop, this determines which function is neccessary
      "togglePlay": {

        "value": function (mediaURL) {
          //set the requested mediaURL to the object
          this.mediaURL = mediaURL
          
          //if there is nothing playing, play the file
          if (this.currentlyPlaying === false) {
            this.playRecording()

          //if there is a file playing and the requested url is equal to the url saved on the mediaObject, stop playing
        } else if (this.mediaURL === this.mediaObject.src) {
          this.mediaObject.stop()
          this.currentlyPlaying = false

          //if there is a file playing and the requested url is NOT equal to the url saved on the mediaObject, stop playing the current media object and create a new one and start playing
        } else {
          this.playlist = []
          this.mediaObject.stop()
          this.playRecording()
        }
      }
    },
    
    "playRecording": {
      //create a new media object from the requested URL and play it, if the entire file plays, set currentlyPlaying to false
        "value": function () {

          let onSuccess = () => {
            console.log("success")
            this.currentlyPlaying = false
          }

          let onError = (error) => {
            console.log(JSON.stringify(error))
          }

          let mediaStatusCallback = function (status) {
            if (status == 1) {
              $rootScope.show('Loading...');
            } else {
              $rootScope.hide();
            }
          }

          this.currentlyPlaying = true
          this.mediaObject = new Media(this.mediaURL, onSuccess, onError, mediaStatusCallback)
          console.log(JSON.stringify(this.mediaObject))
          this.mediaObject.play();
        }
      },

      //functions for controlling the recording and saving of audio

      //place to save the uid of the recording
      "recordingUID": { "value": "", "writable": true, "enumberable": true },
      
      //local storage location of recorded files
      "filePath": { "value": "cdvfile://localhost/temporary/", "writable": true, "enumberable": true },
      
      //save the recordingObj here
      "recordingObj": { "value": null, "writable": true, "enumberable": true },
      
      //play and stop the recordingObj after recording
      "reviewRecording": {
        "value": function () {
          if (!this.currentlyPlaying && this.recordingObj) {
            this.currentlyPlaying = true
            this.recordingObj.play()
          } else {
            this.currentlyPlaying = false
            this.recordingObj.stop()
          }
        }
      },
      
      //create a new media object with a uid of the userUid and the timestamp and start recording
      "start": {
        "value": function () {
          
          this.currentlyPlaying = false
          
          this.recordingUID = firebase.auth().currentUser.uid + Date.now() + ".m4a"
          
          this.recordingObj = $cordovaMedia.newMedia(this.filePath + this.recordingUID)
          
          this.recordingObj.startRecord();
        }
      },

      //stop recording
      "stop": {
        "value": function () {
          this.recordingObj.stopRecord();
        }
      },
      
      //save recording to firebase and return the downloadURL
      "save": {
        "value": function () {
          
          $rootScope.show('<ion-spinner></ion-spinner>')
          
          let storageRef = firebase.storage().ref();
          
          let recordingRef = storageRef.child(`recordings/${this.recordingUID}`);
          
          return $cordovaFile.readAsDataURL(cordova.file.tempDirectory, this.recordingUID).then(
            function (success) {
              return recordingRef.putString(success, 'data_url').then(result => {
                $rootScope.hide()
                return recordingRef.getDownloadURL()
              })
            }
          )
        }
      },
      
      //save an array of urls from the favorite playlist here
      "playlist": { "value": [], "writable": true, "enumberable": true },
      
      //track the index of the song being played
      "playlistIndex": { "value": 0, "writable": true, "enumberable": true },
      
      //set the playlist array and playlistIndex, play the track at the startingPosition and then at the end of any track call the playNext function with the onSuccess callback
      //set the playlist array and playlistIndex, play the track at the startingPosition and then at the end of any track call the playNext function with the onSuccess callback
      "playAll": {
        "value": function (songArray, startingPosition) {
          
          this.playlist = songArray
          
          this.playlistIndex = startingPosition
          
          if(this.currentlyPlaying === true) {
            this.mediaObject.stop()
            this.currentlyPlaying = false
          }
          
          let onSuccess = () => {
            this.currentlyPlaying = false
            this.playlistIndex++
            playNext()
          }
          
          let onError = (error) => {
            console.log(JSON.stringify(error))
          }
          
          let mediaStatusCallback = function (status) {
            if (status == 1) {
              $rootScope.show('Loading...');
            } else {
              $rootScope.hide();
            }
          }
          
          let playNext = () => {
            if(this.playlistIndex <= this.playlist.length){
              this.currentlyPlaying = true
              this.mediaObject = new Media(this.playlist[this.playlistIndex].recordingURL, onSuccess, onError, mediaStatusCallback)
              this.mediaObject.play()
            }
          }
          
          playNext()
        }
      },
      
      //remove the playlist and stop the playing track
      "playAllStop": {
        "value": function () {
          this.playlist = []
          this.mediaObject.stop()
        }
      },
      
      //go back to the previous song in the playlist, if it is the first song, go to the beggining of the first song
      "playAllPrevious": {
        "value": function () {
          if(this.playlistIndex > 0){
            this.playlistIndex -= 2
          } else {
            this.playlistIndex -= 1
          }
          this.mediaObject.stop()
        }
      },
      
      //go back to the next song in the playlist
      "playAllNext": {
        "value": function () {
          this.mediaObject.stop()
        }
      },
    })
  })



