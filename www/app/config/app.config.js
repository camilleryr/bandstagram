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
                StatusBar.styleDefault();
            }
        });

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            var user = firebase.auth().currentUser;
            if (toState.authRequired && ( !user || toState.authRequired !== user.displayName)) { //Assuming the AuthService holds authentication logic
                // User isn’t authenticated
                $state.transitionTo("auth");
                event.preventDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('auth', {
                url: '/auth',
                templateUrl: 'app/auth/partial/auth.html',
                controller: 'authCtrl',
            })

            // setup an abstract state for the band tabs directive
            .state('band', {
                url: '/band',
                abstract: true,
                templateUrl: 'app/nav/bandNav.html'
            })


            .state('band.home', {
                url: '/home',
                authRequired: "band",
                views: {
                    'band-home': {
                        templateUrl: 'app/band/partial/bandHome.html',
                        controller: 'bandHomeCtrl',
                    }
                }
            })

            .state('band.add', {
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
                url: '/home',
                authRequired: "fan",
                views: {
                    'fan-home': {
                        templateUrl: 'app/fan/partial/fanHome.html',
                        controller: 'fanHomeCtrl',
                    }
                }
            })

            .state('fan.search', {
                url: '/search',
                authRequired: "fan",
                views: {
                    'fan-search': {
                        templateUrl: 'app/fan/partial/fanSearch.html',
                        controller: 'fanSearchCtrl',
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
