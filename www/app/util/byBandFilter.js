angular.module('bandstagram')
  .filter('byBand', function () {
    return function (recordings, bandArray, bandTable) {
      bandTable = Object.values(bandTable)
      var out = [];
      //user.name
      angular.forEach(recordings, function (recording) {
        if (bandArray.indexOf(recording.bandUID) > -1) {
          let band = bandTable.find(band => band.uid === recording.bandUID)
          recording.bandName = band.bandName
          recording.photoURL = band.photoURL
          out.push(recording);
        }
      });
      return out;
    };
  })