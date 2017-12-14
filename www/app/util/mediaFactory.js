angular.module('bandstagram')
  .factory("mediaFactory", function ($cordovaMedia) {
    return Object.create(null, {
      "mediaURL" : {"value": null, "writable": true, "enumerable": true},

      "mediaObject" : {"value": { "media" : { "src" : false } }, "writable": true, "enumerable": true},

      "currentlyPlaying" : {"value": false, "writable": true, "enumerable": true},

      "togglePlay": {"value": function(mediaURL) {
        this.mediaURL = mediaURL

        if (!this.currentlyPlaying && this.mediaURL === this.mediaObject.media.src){
          this.playRecording()
        }

        if (this.currentlyPlaying){
          console.log("Stop")
          this.mediaObject.stop()
          this.currentlyPlaying = false
        }

        if (this.mediaURL !== this.mediaObject.media.src){
          this.playRecording()
        }
      }},
      
      "playRecording" : {"value": function () {
        console.log("Play")
        this.currentlyPlaying = true
        this.mediaObject = $cordovaMedia.newMedia(this.mediaURL)
        console.log(JSON.stringify(this.mediaObject))
        this.mediaObject.play();
      }}
    })
  })



