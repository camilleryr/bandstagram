angular.module('bandstagram')
  .filter('fanSearchFilter', function () {

    //adds the followed property to any band that has been followed by a user
    
    return function (bandTable, favoriteArray) {
      
      var out = [];
      
      angular.forEach(bandTable, function (band) {
        let favoriteArrayIndex = favoriteArray.map(x => x.bandUID).indexOf(band.uid)
        if (favoriteArrayIndex > -1) {
          band.followed = true
          band.followedID = favoriteArray[favoriteArrayIndex].id
        }
        
        out.push(band);
      })
      
      return out;
    }
  })
  
  .filter('favoriteFilter', function () {

    //filters the band array by the filterValue as determined by the buttons in the search view

    return function (filteredBands, filterValue) {

      var out = [];

      if (filterValue === 'all') {
        return filteredBands

      } else if (filterValue === 'followed') {
        angular.forEach(filteredBands, function (band) {
          if (band.followed === true) {
            out.push(band)
          }
        })
        return out;
      } else {
        angular.forEach(filteredBands, function (band) {
          if (band.followed !== true) {
            out.push(band)
          }
        })
        return out;
      }
    }
  })