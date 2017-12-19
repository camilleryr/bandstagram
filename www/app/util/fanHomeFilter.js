angular.module('bandstagram')
  .filter('fanHomeFilter', function () {
    return function (recordings, bandArray, bandTable, voteTable) {
      bandTable = Object.values(bandTable)
      var out = [];
      //user.name
      angular.forEach(recordings, function (recording) {
        if (bandArray.indexOf(recording.bandUID) > -1) {
          
          let band = bandTable.find(band => band.uid === recording.bandUID)
          recording.bandName = band.bandName
          recording.photoURL = band.photoURL
          
          let vote = voteTable.find(vote => vote.recordingID === recording.id)
          if(vote){
            recording.vote = vote.vote
          }
          out.push(recording);
        }
      });
      return out;
    };
  })