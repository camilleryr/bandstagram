angular.module('bandstagram')
.controller('bandAddCtrl', function($scope, $state) {
    $scope.srcImage = "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fcnet4.cbsistatic.com%2Ffly%2F893-fly%2Fbundles%2Fcnetcss%2Fimages%2Fplaceholder%2Fimage_placeholder.png&f=1"
    $scope.recordingInfo = {}

    $scope.takePicture = function() {
        var options = {
          quality: 80,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 250,
          targetHeight: 250,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
      };
    
      $cordovaCamera.getPicture(options).then(function(imageData) {
          $scope.srcImage = "data:image/jpeg;base64," + imageData;
      }, function(err) {
          // error
      });
    }
    
})