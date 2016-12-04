bullsCows
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");


        $stateProvider
            //------------------------------
            // HOME
            //------------------------------

            .state ('home', {
                url: '/home',
                templateUrl: 'views/start.html'
            })
            

            .state ('games', {
                url: '/games/:gameid',
                templateUrl: 'views/game.html',
                controller: function($scope, $stateParams) {
                    $scope.gameid = $stateParams.gameid;
                }
            })

            .state ('user', {
                url: '/user',
                templateUrl: 'views/user-common.html'
            })

            .state ('user.settings', {
                url: '/settings',
                templateUrl: 'views/settings.html'
            })

    });
