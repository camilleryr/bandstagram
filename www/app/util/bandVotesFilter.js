angular.module('bandstagram')
    .filter('bandVotes', function () {

        // add vote info to songs

        return function (recordings, voteTable) {
            let out = [];
            let recordingUIDArray = recordings.map(recording => recording.id)

            angular.forEach(voteTable, function (vote) {
                if(recordingUIDArray.indexOf(vote.recordingID) > -1){
                    out.push(vote)
                }
            });
            return out;
        };
    })