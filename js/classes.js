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

        Guess.prototype.getAll = function() {
            var self = this;

            return $http.get(apiUrl + 'games/' + this.gameId + '/guesses')
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

        // From ES6/ES2015, default parameters is in the language specification.
        // http://stackoverflow.com/questions/894860/set-a-default-parameter-value-for-a-javascript-function

        Guess.prototype.getBest = function(count) {
            var self = this;
            count = count || 5; // 5 by default

            return $http.get(apiUrl + 'games/' + this.gameId + '/guesses?best=' + count)
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

        Guess.prototype.getZero = function(count) {
            var self = this;
            count = count || 5; // 5 by default

            return $http.get(apiUrl + 'games/' + this.gameId + '/guesses?zero=' + count)
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

        var Game = function(secret, gameId, length, complexity) {
            this.secret = secret;
            this.gameId = gameId;
            this.length = length;
            this.complexity = complexity;
        };

        Game.prototype.create = function() {
            var self = this,
                data = {
                    'secret': this.secret,
                    'length': this.length,
                    'language': 'EN',
                    'complexity': this.complexity
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

        Hint.prototype.getAll = function() {
            var self = this;

            return $http.get(apiUrl + 'games/' + this.gameId + '/hints')
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