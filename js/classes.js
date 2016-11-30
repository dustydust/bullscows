// On production use HTTPS
// https://github.com/chieffancypants/angular-loading-bar

bullsCows

    .factory('Guess', function($http) {
        var apiUrl = 'http://s-bullsandcowsbot.herokuapp.com/';

        var Guess = function(guess, gameId) {
            this.guess = guess;
            this.gameId = gameId;
        };

        Guess.prototype.create = function() {
            var self = this;
            // Only game lenght word or 500 error
            var data = {
              'guess': this.guess
            };

            var config = {
                headers : {
                   'Content-Type': 'application/json; charset=utf-8'
                },
                ignoreLoadingBar: true
            }

            return $http.post(apiUrl + 'games/' + this.gameId + '/guesses', data, config)
                .then(
                    function(response) {
                        self.answer = response;
                        return response;
                    },
                    function(response) {
                        self.answer = response;
                        return response;
                    }
                );
        };

        return Guess;
    })


    .factory('Game', function($http) {
        var apiUrl = 'http://s-bullsandcowsbot.herokuapp.com/';

        var Game = function(secret, gameId) {
            this.secret = secret;
            this.gameId = gameId;
        };

        Game.prototype.create = function() {
            var self = this,
                data = {
                    'secret': this.secret
                },

                config = {
                    headers : {
                       'Content-Type': 'application/json; charset=utf-8'
                    }
                }

            return $http.post(apiUrl + 'games', data, config)
                .then(
                    function(response) {
                        self.answer = response;
                        return response;
                    },
                    function(response) {
                        self.answer = response;
                        return response;
                    }
                );
        }

        Game.prototype.getDetails = function() {
            var self = this;

            return $http.get(apiUrl + 'games/' + this.gameId)
                .then(
                    function(response) {
                        self.answer = response;
                        return response;
                    },
                    function(response) {
                        self.answer = response;
                        return response;
                    }
                );
        }

        Game.prototype.stop = function() {
            var self = this,
                data = {
                    'status': 'aborted'
                }

            var config = {
                headers : {
                   'Content-Type': 'application/json; charset=utf-8'
                }
            }

            return $http.put(apiUrl + 'games/' + this.gameId, data, config)
                .then(
                    function(response) {
                        self.answer = response;
                        return response;
                    },
                    function(response) {
                        self.answer = response;
                        return response;
                    }
                );
        }

        return Game;
    })

    .factory('Hint', function($http) {
        var apiUrl = 'http://s-bullsandcowsbot.herokuapp.com/';

        var Hint = function(hint, gameId) {
            this.hint = hint;
            this.gameId = gameId;
        };

        Hint.prototype.check = function() {
            var self = this,
                data = {
                    'hint': this.hint
                },

                config = {
                    headers : {
                       'Content-Type': 'application/json; charset=utf-8'
                    },
                    ignoreLoadingBar: true
                }

            return $http.post(apiUrl + 'games/' + this.gameId + '/hints', data, config)
                .then(
                    function(response) {
                        self.answer = response;
                        return response;
                    },
                    function(response) {
                        self.answer = response;
                        return response;
                    }
                );
        }

        return Hint;
    })