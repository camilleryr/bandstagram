angular.module('bandstagram')
  .filter('fanHomeFilter', function () {
    return function (recordings, bandArray, bandTable, voteTable, favoriteTable) {
      bandArray = bandArray.map(x => x.bandUID)
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

          let favorite = favoriteTable.find(fav => fav.recordingID === recording.id)
          if(favorite){
            recording.favorite = favorite.position
            recording.favoriteID = favorite.id
          }

          out.push(recording);
        }
      });
      return out;
    };
  })