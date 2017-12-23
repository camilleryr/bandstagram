//Configure state routing and is auth function

angular.module('bandstagram')
    .run(function ($ionicPlatform, FIREBASE_CONFIG, $rootScope, $state) {

        //Add firebase to add
        firebase.initializeApp(FIREBASE_CONFIG)

        //Ionic keyboard stuff - Dont know what it does, but dont mess with it!
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.overlaysWebView(false)
            }
        });

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            var user = firebase.auth().currentUser;
            if (toState.authRequired && (!user || toState.authRequired !== user.displayName)) { //Assuming the AuthService holds authentication logic
                // User isn’t authenticated
                $state.transitionTo("auth");
                event.preventDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.backButton.previousTitleText(false);
        $ionicConfigProvider.backButton.icon('ion-chevron-left');
        $ionicConfigProvider.backButton.text('')

        $stateProvider

            .state('auth', {
                url: '/auth',
                templateUrl: 'app/auth/partial/auth.html',
                controller: 'authCtrl'
            })

            // setup an abstract state for the band tabs directive
            .state('band', {
                url: '/band',
                abstract: true,
                templateUrl: 'app/nav/bandNav.html'
            })


            .state('band.home', {
                cache: false,
                url: '/home',
                authRequired: "band",
                views: {
                    'band-home': {
                        templateUrl: 'app/band/partial/bandHome.html',
                        controller: 'bandHomeCtrl',
                    }
                }
            })

            .state('band.list', {
                cache: false,
                url: '/list',
                authRequired: "band",
                views: {
                    'band-list': {
                        templateUrl: 'app/band/partial/bandList.html',
                        controller: 'bandListCtrl',
                    }
                }
            })

            .state('band.list.details', {
                url: '/recordingDetails',
                parent: 'band',
                authRequired: "band",
                views: {
                    'band-list': {
                        templateUrl: 'app/band/partial/bandList-details.html',
                        controller: 'recordingDetailsCtrl',
                    }
                }
            })

            .state('band.add', {
                cache: false,
                url: '/add',
                authRequired: "band",
                views: {
                    'band-add': {
                        templateUrl: 'app/band/partial/bandAdd.html',
                        controller: 'bandAddCtrl',
                    }
                }
            })

            // setup an abstract state for the fan tabs directive
            .state('fan', {
                url: '/fan',
                abstract: true,
                templateUrl: 'app/nav/fanNav.html'
            })


            .state('fan.home', {
                cache: false,
                url: '/home',
                authRequired: "fan",
                views: {
                    'fan-home': {
                        templateUrl: 'app/fan/partial/fanHome.html',
                        controller: 'fanHomeCtrl',
                    }
                }
            })

            .state('fan.favorites', {
                cache: false,
                url: '/favorites',
                authRequired: "fan",
                views: {
                    'fan-favorites': {
                        templateUrl: 'app/fan/partial/fanFavorites.html',
                        controller: 'fanFavoritesCtrl',
                    }
                }
            })

            .state('fan.search', {
                cache: false,
                url: '/search',
                authRequired: "fan",
                views: {
                    'fan-search': {
                        templateUrl: 'app/fan/partial/fanSearch.html',
                        controller: 'fanSearchCtrl',
                    }
                }
            })

            .state('fan.search.details', {
                url: '/:bandUID:favorite',
                parent: 'fan',
                authRequired: "fan",
                views: {
                    'fan-search': {
                        templateUrl: 'app/fan/partial/fanSearch-details.html',
                        controller: 'bandDetailsCtrl',
                    }
                }
            })


        $urlRouterProvider.otherwise('/auth');

    })




// const isAuth = authFactory => new Promise((resolve, reject) => {
//     if (authFactory.isAuthenticated()) {
//         console.log("User is authenticated, resolve route promise")
//         resolve()
//     } else {
//         console.log("User is not authenticated, reject route promise")
//         reject()
//     }
// })
