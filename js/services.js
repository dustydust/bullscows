bullsCows

    // =========================================================================
    // Header Messages and Notifications list Data
    // =========================================================================

    .service('messageService', ['$resource', function($resource){
        this.getMessage = function(img, user, text) {
            var gmList = $resource("data/messages-notifications.json");
            
            return gmList.get({
                img: img,
                user: user,
                text: text
            });
        }
    }])


    // =========================================================================
    // Services for game 
    // =========================================================================

    // Get game status

    .service('getGameStatusbyidService', ['$resource', function($resource) {
        this.getGame = function(params) {
            var dGame = $resource('http://s-bullsandcowsbot.herokuapp.com/games/:gameid');

            return dGame.get({
                gameid: params.gameid
            });
        }
    }])


    .service('getgamedialogService', ['$resource', function($resource) {
        this.getDialog = function(type, text) {
            var dList = $resource("data/gamedialog.json");

            return dList.get({
                type: type,
                text: text
            });
        }
    }])

    // Get list of created games

    .service('getGamelistService', ['$resource', function($resource) {
        this.getGames = function(link, source) {
            var dGames = $resource('http://s-bullsandcowsbot.herokuapp.com/games?status=created');

            return dGames.get({
                // link: link,
                // source: source
            });
        }
    }])

    // =========================================================================
    // Services for game guesses
    // =========================================================================

    // Get guesslist of game

    .service('getGuessesbyidService', ['$resource', function($resource) {
        this.getGuesses = function(params) { // gameid, word, bulls, cows
            var dGuesses = $resource('http://s-bullsandcowsbot.herokuapp.com/games/:gameid/guesses');

            return dGuesses.get({
                gameid: params.gameid
            });
        }
    }])

    // Get best guesslist of game

    .service('getBestGuessesbyidService', ['$resource', function($resource) {
        this.getGuesses = function(params) {
            var dGuesses = $resource('http://s-bullsandcowsbot.herokuapp.com/games/:gameid/guesses?best=:limit');

            return dGuesses.get({
                gameid: params.gameid,
                limit: params.limit
            });
        }
    }])

    // Get zero guesslist of game

    .service('getZeroGuessesbyidService', ['$resource', function($resource) {
        this.getGuesses = function(params) {
            var dGuesses = $resource('http://s-bullsandcowsbot.herokuapp.com/games/:gameid/guesses?zero=:limit');

            return dGuesses.get({
                gameid: params.gameid,
                limit: params.limit
            });
        }
    }])

    // Post game guess

    .service('postGuesstoidService', ['$resource', function($resource) {
        this.postGuess = function(params) {
            var dGuess = $resource('http://s-bullsandcowsbot.herokuapp.com/games/:gameid/guesses', { gameid: '@gameid' });

            return dGuess.post({
                gameid: params.gameid,
                guess: params.guess
            });
        }
    }])


    // =========================================================================
    // Malihu Scroll - Custom Scroll bars
    // =========================================================================
    .service('scrollService', function() {
        var ss = {};
        ss.malihuScroll = function scrollBar(selector, theme, mousewheelaxis) {
            $(selector).mCustomScrollbar({
                theme: theme,
                scrollInertia: 100,
                axis:'yx',
                mouseWheel: {
                    enable: true,
                    axis: mousewheelaxis,
                    preventDefault: true
                }
            });
        }
        
        return ss;
    })


    //==============================================
    // BOOTSTRAP GROWL
    //==============================================

    .service('growlService', function(){
        var gs = {};
        gs.growl = function(message, type) {
            $.growl({
                message: message
            },{
                type: type,
                allow_dismiss: false,
                label: 'Cancel',
                className: 'btn-xs btn-inverse',
                placement: {
                    from: 'top',
                    align: 'right'
                },
                delay: 2500,
                animate: {
                        enter: 'animated bounceIn',
                        exit: 'animated bounceOut'
                },
                offset: {
                    x: 20,
                    y: 85
                }
            });
        }
        
        return gs;
    })
