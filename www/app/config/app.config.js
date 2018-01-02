//Configure state routing and is auth function

angular.module('bandstagram')
    .run(function ($ionicPlatform, FIREBASE_CONFIG, $rootScope, $state, $timeout, $ionicLoading) {

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

        //This function prevents navigating to states that require authentication -- there is a property on the firebase user object that will be either fan or band after succesful registration and all non authentication states reuire the authRequired property of the state to equal either fan or band as well.  This checks the firebase user object property against the views authRequired property and redirects to the auth page if they do not match

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            var user = firebase.auth().currentUser;
            if (toState.authRequired && (!user || toState.authRequired !== user.displayName)) {
                $state.transitionTo("auth");
                event.preventDefault();
            }
        });

        //Rootscope function to show loading icon
        $rootScope.toggle = function (text, timeout) {
            $rootScope.show(text);

            $timeout(function () {
                $rootScope.hide();
            }, (timeout || 1000));
        };

        $rootScope.show = function (text) {
            $ionicLoading.show({
                template: text
            });
        };

        $rootScope.hide = function () {
            $ionicLoading.hide();
        };
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        //Add back button to nested views
        $ionicConfigProvider.backButton.previousTitleText(false);
        $ionicConfigProvider.backButton.icon('ion-chevron-left');
        $ionicConfigProvider.backButton.text('')

        //Configure each view
        $stateProvider

            //Authentication page
            .state('auth', {
                url: '/auth',
                templateUrl: 'app/auth/partial/auth.html',
                controller: 'authCtrl'
            })

            //Registration page after a new account is created page
            .state('register', {
                url: '/register',
                templateUrl: 'app/auth/partial/register.html',
                controller: 'registerCtrl'
            })


            // setup an abstract state for the band tabs directive
            .state('band', {
                url: '/band',
                abstract: true,
                templateUrl: 'app/nav/bandNav.html'
            })


            // home page for bands - show account stats
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

            // list all posts from band's account
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

            // Details for one post from a band account - for edditing
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

            // State to add a new post
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


            // Fan home page - scroll of posts from followed bands
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

            // Playlist page of favorited tracks
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

            // Search for bands to follow / unfollow
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

            // details of individual bands
            .state('fan.search.details', {
                url: '/:bandUID:followed',
                parent: 'fan',
                authRequired: "fan",
                views: {
                    'fan-search': {
                        templateUrl: 'app/fan/partial/fanSearch-details.html',
                        controller: 'bandDetailsCtrl',
                    }
                }
            })


        // if the url does not match any state provided, navigate to the auth view
        $urlRouterProvider.otherwise('/auth');

    })

