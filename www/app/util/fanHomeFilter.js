angular.module('bandstagram')
  .filter('fanHomeFilter', function () {

    //returns the filtered array of songs by all liked bands for a user with properties added for BandName / bandPhotoUrl / Vote / Favorite

    return function (recordings, followedBandArray, bandTable, voteTable, favoriteTable) {
      
      followedBandArray = followedBandArray.map(x => x.bandUID)
      bandTable = Object.values(bandTable)
      
      var out = [];
      
      //go through each song in the recordingTable
      angular.forEach(recordings, function (recording) {

        //if the recording is posted by a band that is followed 
        if (followedBandArray.indexOf(recording.bandUID) > -1) {
          
          //match band info from bandTable to the bandUID from the recording and add the name and photo to the recording object
          let band = bandTable.find(band => band.uid === recording.bandUID)
          recording.bandName = band.bandName
          recording.photoURL = band.photoURL
          
          //match the song to a vote if present and add it to the recording object
          let vote = voteTable.find(vote => vote.recordingID === recording.id)
          if(vote){
            recording.vote = vote.vote
          }
          
          //match the song to a favorite if present and add it to the recording object
          let favorite = favoriteTable.find(fav => fav.recordingID === recording.id)
          if(favorite){
            recording.favorite = favorite.position
            recording.favoriteID = favorite.id
          }
          
          //add the recording to the returned array
          out.push(recording);
        }
      });
      return out;
    };
  })