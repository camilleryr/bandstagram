angular.module('bandstagram')
  .filter('bandListFilter', function () {
    
    //add vote information to songs

    return function (recordings, voteTable) {
      var out = [];
      angular.forEach(recordings, function (recording) {
        let voteArray = voteTable.filter(vote => vote.recordingID === recording.id)
        let down = 0
        let up = 0

        voteArray.forEach(vote => {
            if(vote.vote === -1){
                down += 1
            } else if (vote.vote === 1){
                up += 1
            }
        })
        
        recording.vote={"down":down,"up":up}
        out.push(recording)
      });
      return out;
    };
  })