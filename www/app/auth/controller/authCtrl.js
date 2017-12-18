

angular.module('bandstagram')
    .controller('authCtrl', function ($scope, $state, databaseFactory, authFactory, photoFactory, $ionicModal) {

        $scope.placeholder = photoFactory.placeholder

        $scope.takePicture = function () {
            photoFactory.takePhoto().then(result => {
                console.log(result)
                $scope.userInfo.photoURL = result
            })
        }

        $scope.auth = {
            "email": null,
            "password": null,
            "account": null,
        }
        
        $scope.logMeIn = function () {
            authFactory.authenticate($scope.auth).then(function (didLogin) {
                $scope.auth = {}
            })
        }
        
        $scope.registerUser = function () {
            authFactory.registerWithEmail($scope.auth).then(user => {
                $scope.user = user
                $scope.openModal()
            })
        }
        
        $scope.console = function () {
            console.log($scope.userInfo)
            console.log($scope.auth)
        }
        
        
        $ionicModal.fromTemplateUrl('app/auth/partial/modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        
        $scope.openModal = function () {
            $scope.userInfo = {}
            $scope.modal.show();
        };

        $scope.closeModal = function (bool) {
            $scope.modal.hide();
            if (bool) {
                console.log("save")
                $scope.user.updateProfile({ "displayName": $scope.auth.account })
                $scope.userInfo.uid = $scope.user.uid
                console.log($scope.userInfo)
                databaseFactory.postUserInfo($scope.auth.account, $scope.userInfo)
                authFactory.logout()
                $scope.logMeIn()
            }
        }
    })

