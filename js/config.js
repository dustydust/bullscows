bullsCows
    .config(function ($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/home");


        $stateProvider
        
            //------------------------------
            // HOME
            //------------------------------

            .state ('home', {
                url: '/home',
                templateUrl: 'views/start.html'
            })
            

            .state ('game', {
                url: '/game',
                templateUrl: 'views/game-common.html'
            })

            .state ('game.process', {
                url: '/process',
                templateUrl: 'views/game.html'
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
