bullsCows
    // =========================================================================
    // Base controller for common functions
    // =========================================================================

    .controller('bullscowsCtrl', function($timeout, $state, $scope, $location, getgamedialogService, growlService, $http){
        //Welcome Message
        // growlService.growl('Welcome back Mallinda!', 'inverse')
        
        // Detact Mobile Browser
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
           angular.element('html').addClass('ismobile');
        }

        // By default Sidbars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
        this.sidebarToggle = {
            left: false,
            right: false
        }

        // By default template has a boxed layout
        this.layoutType = localStorage.getItem('ma-layout-status');
        
        // For Mainmenu Active Class
        this.$state = $state;
        
        //Close sidebar on click
        this.sidebarStat = function(event) {
            if (!angular.element(event.target).parent().hasClass('active')) {
                this.sidebarToggle.left = false;
            }
        }
        
        //Listview Search (Check listview pages)
        this.listviewSearchStat = false;
        
        this.lvSearch = function() {
            this.listviewSearchStat = true; 
        }
        
        //Listview menu toggle in small screens
        this.lvMenuStat = false;
        
        //Blog
        this.wallCommenting = [];
        
        this.wallImage = false;
        this.wallVideo = false;
        this.wallLink = false;

        this.currentSkin = 'orange';

        this.skinSwitch = function (color) {
            this.currentSkin = color;
        }

    })

    .controller('creategameCtrl', function($scope, $location, Game)
    {
        $scope.secretWord = '';

        this.showBlocks = {
            createMenu: false,
            gameHelp: false
        }

        this.gameLang = {
            selected: { val: 'EN' }, // by default
            list: [
                { val: 'EN' },
                { val: 'RU' },
                { val: 'IT' },
                { val: 'DE' },
                { val: 'FR' }
            ]
        }

        this.gameParams = {
            length: {
                selected: { val: 6 }, // by default
                list: [
                    { val: 4 },
                    { val: 5 },
                    { val: 6 },
                    { val: 7 },
                    { val: 8 }
                ]
            },
            difficulty: {
                selected: { val: 'easy'}, // by default
                list: [
                    { val: 'easy',      text: 'easy' },
                    { val: 'medium',    text: 'normal' },
                    { val: 'hard',      text: 'hard' }
                ]
            },
            secret: ''
        }

        this.checkOverlay = function(event) {
            if (angular.element(event.target).hasClass('overlay-close'))
                {
                    this.showBlocks.gameHelp = false;
                }
        }

        this.showHelp = function(event) {
            if (this.showBlocks.gameHelp == false)
                this.showBlocks.gameHelp = true;
            else
                this.showBlocks.gameHelp = false;
        }

        this.setLang = function(item) {
            this.gameLang.selected = item;
        }

        this.setLength = function(item) {
            this.gameParams.length.selected = item;
        }

        this.setDifficulty = function(item) {
            this.gameParams.difficulty.selected = item;
        }


        this.showCreateMenu = function(event) {
            if (this.showBlocks.createMenu == false)
                this.showBlocks.createMenu = true;
            else
                this.showBlocks.createMenu = false;
        }

        this.createGame = function () {
            var secret = $scope.secretWord;
            if (secret.length > 3)
            {
                var game = new Game(secret);
                game.create().then(function() {
                    if (game.answer.data.game.link)
                    {
                        $location.path(game.answer.data.game.link);
                    }
                });
            }
            else
            {
                var game = new Game(false, false, this.gameParams.length.selected.val, this.gameParams.difficulty.selected.val, this.gameLang.selected.val);
                game.create().then(function() {
                    if (game.answer.data.game.link)
                    {
                        $location.path(game.answer.data.game.link);
                    }
                });
            }
        }
    })


    .controller('gamedialogCtrl', function(
                                            $scope,
                                            Guess,
                                            Game,
                                            Hint,
                                            $location,
                                            getgamedialogService,
                                            getGuessesbyidService,
                                            getBestGuessesbyidService,
                                            getZeroGuessesbyidService,
                                            getGameStatusbyidService,
                                            postGuesstoidService
                                        )
        {

        this.showBlocks = {
            gameMenu: false,
            gameHelp: false
        }

        //Get Recent Game Dialog
        $scope.textMessage = '';
        $scope.gdResultGuesses      = getGuessesbyidService.getGuesses( { gameid: $scope.gameid } );
        $scope.gdResultGameStatus   = getGameStatusbyidService.getGame( { gameid: $scope.gameid } );
        
        $scope.gdResultZeroGuesses  = getZeroGuessesbyidService.getGuesses( { gameid: $scope.gameid, limit: 5 } );

        // Get quantity of Hints
        // this.getHintsQuantity = function(event) {
        //     var hint = new Hint(false, $scope.gameid);
        //     hint.getAll().then(function() {
        //         $scope.valval = hint.answer.data.hints.length;
        //     });
        // }
        // Because better get all of quntities by one request from Game details

        this.checkOverlay = function(event) {
            if (angular.element(event.target).hasClass('overlay-close')) {
                this.showBlocks.gameHelp = false;
                this.showBlocks.gameMenu = false;
            }
        }

        this.showGameMenu = function(event) {
            if (this.showBlocks.gameMenu == false)
                this.showBlocks.gameMenu = true;
            else
                this.showBlocks.gameMenu = false;
        }

        this.showHelp = function(event) {
            this.showBlocks.gameMenu = false;

            if (this.showBlocks.gameHelp == false)
                this.showBlocks.gameHelp = true;
            else
                this.showBlocks.gameHelp = false;
        }

        this.showBests = function(event) {
            var guess = new Guess(false, $scope.gameid);
            guess.getBest().then(function() {
                $scope.gdResultGuesses.guesses.push({ word: 'Best', class: 'best' });
                for (var i = 0; i < guess.answer.data.best.length; i++) {
                    $scope.gdResultGuesses.guesses.push({ word: guess.answer.data.best[i].word, bulls: guess.answer.data.best[i].bulls, cows: guess.answer.data.best[i].cows, class: 'best-detail' });
                }
                $('.mbl-messages').mCustomScrollbar('scrollTo',$(document).find('#process-game-window').height());
            });
            this.showBlocks.gameMenu = false;
        }

        this.showZeros = function(event) {
            var guess = new Guess(false, $scope.gameid);
            guess.getZero().then(function() {
                $scope.gdResultGuesses.guesses.push({ word: 'Zero', class: 'zero' });
                for (var i = 0; i < guess.answer.data.zero.length; i++) {
                    $scope.gdResultGuesses.guesses.push({ word: guess.answer.data.zero[i].word, bulls: guess.answer.data.zero[i].bulls, cows: guess.answer.data.zero[i].cows, class: 'zero-detail' });
                }
                $('.mbl-messages').mCustomScrollbar('scrollTo',$(document).find('#process-game-window').height());
            });
            this.showBlocks.gameMenu = false;
        }

        this.showHints = function(event) {
            var hint = new Hint(false, $scope.gameid);
            hint.getAll().then(function() {
                $scope.gdResultGuesses.guesses.push({ word: 'Hints', class: 'hints' });
                for (var i = 0; i < hint.answer.data.hints.length; i++) {
                    $scope.gdResultGuesses.guesses.push({ word: hint.answer.data.hints[i].letter, match: hint.answer.data.hints[i].match, class: 'hint-detail' });
                }
                $('.mbl-messages').mCustomScrollbar('scrollTo',$(document).find('#process-game-window').height());
            });
            this.showBlocks.gameMenu = false;
        }

        this.stopGame = function() {
            var game = new Game(false, $scope.gameid);
            game.stop().then(function() {
                $location.path('/home');
            });
        }

        this.sendMessage = function(event) {

            if (event.which == 13 || event.which == 1)
            {
                event.preventDefault();
                if ($scope.textMessage.length == 2 && $scope.textMessage.slice(1,2) == '?')
                {
                    var firstSymbol = $scope.textMessage.slice(0,1);

                    var hint = new Hint(firstSymbol, $scope.gameid);
                    hint.check().then(function() {
                        if (hint.answer.data.hint.match)
                        {
                            $scope.gdResultGuesses.guesses.push({ word: '"' + firstSymbol + '"' + ' has a match' });
                        }
                        else
                        {
                            $scope.gdResultGuesses.guesses.push({ word: '"' + firstSymbol + '"' + ' doesn\'t match' });
                        }
                        $('.mbl-messages').mCustomScrollbar('scrollTo',$(document).find('#process-game-window').height());
                    });
                    $scope.textMessage = '';
                    $scope.gdResultGameStatus = getGameStatusbyidService.getGame( { gameid: $scope.gameid } );
                }
                else if ($scope.textMessage.length == $scope.gdResultGameStatus.game.secret.length)
                {
                    var guess = new Guess($scope.textMessage, $scope.gameid);
                    guess.create().then(function() {
                        if (guess.answer.data.guess.exact)
                        {
                            $scope.gdResultGuesses.guesses.push(guess.answer.data.guess);
                            $scope.gdResultGuesses.guesses.push({ word: 'Congratulations! You write the correct word!' });
                            $('.mbl-messages').mCustomScrollbar('scrollTo',$(document).find('#process-game-window').height());
                        }
                        else
                        {
                            $scope.gdResultGuesses.guesses.push(guess.answer.data.guess);
                            $('.mbl-messages').mCustomScrollbar('scrollTo',$(document).find('#process-game-window').height());
                        }
                    });
                    $scope.textMessage = '';
                    $scope.gdResultGameStatus = getGameStatusbyidService.getGame( { gameid: $scope.gameid } );
                }
                else
                {
                    $scope.gdResultGuesses.guesses.push({ word: 'Wrong length!' });
                    $('.mbl-messages').mCustomScrollbar('scrollTo',$(document).find('#process-game-window').height());
                }
            }
        }

    })

    .controller('gamelistCtrl', function($scope) {
        // Get Recent Game Dialog
        $scope.textMessage = '';
        // $scope.gdResult = getGamelistService.getGames();
    })


    // =========================================================================
    // Header
    // =========================================================================
    .controller('headerCtrl', function($timeout, messageService) {
        
        // Clear Local Storage
        this.clearLocalStorage = function() {
            
            //Get confirmation, if confirmed clear the localStorage
            swal({
                title: "Are you sure?",
                text: "All your saved localStorage values will be removed",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            }, function(){
                localStorage.clear();
                swal("Done!", "localStorage is cleared", "success"); 
            });
            
        }
        
        //Fullscreen View
        this.fullScreen = function() {
            //Launch
            function launchIntoFullscreen(element) {
                if(element.requestFullscreen) {
                    element.requestFullscreen();
                } else if(element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if(element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if(element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }

            //Exit
            function exitFullscreen() {
                if(document.exitFullscreen) {
                    document.exitFullscreen();
                } else if(document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if(document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }

            if (exitFullscreen()) {
                launchIntoFullscreen(document.documentElement);
            }
            else {
                launchIntoFullscreen(document.documentElement);
            }
        }
    
    })


    //=================================================
    // LOGIN
    //=================================================

    .controller('loginCtrl', function(){
        
        //Status
    
        this.login = 1;
        this.register = 0;
        this.forgot = 0;
    })


    // =========================================================================
    // ANIMATIONS DEMO
    // =========================================================================
    .controller('animCtrl', function($timeout){
        
        //Animation List
        this.attentionSeekers = [
            { animation: 'bounce', target: 'attentionSeeker' },
            { animation: 'flash', target: 'attentionSeeker' },
            { animation: 'pulse', target: 'attentionSeeker' },
            { animation: 'rubberBand', target: 'attentionSeeker' },
            { animation: 'shake', target: 'attentionSeeker' },
            { animation: 'swing', target: 'attentionSeeker' },
            { animation: 'tada', target: 'attentionSeeker' },
            { animation: 'wobble', target: 'attentionSeeker' }
        ]
        this.flippers = [
            { animation: 'flip', target: 'flippers' },
            { animation: 'flipInX', target: 'flippers' },
            { animation: 'flipInY', target: 'flippers' },
            { animation: 'flipOutX', target: 'flippers' },
            { animation: 'flipOutY', target: 'flippers'  }
        ]
         this.lightSpeed = [
            { animation: 'lightSpeedIn', target: 'lightSpeed' },
            { animation: 'lightSpeedOut', target: 'lightSpeed' }
        ]
        this.special = [
            { animation: 'hinge', target: 'special' },
            { animation: 'rollIn', target: 'special' },
            { animation: 'rollOut', target: 'special' }
        ]
        this.bouncingEntrance = [
            { animation: 'bounceIn', target: 'bouncingEntrance' },
            { animation: 'bounceInDown', target: 'bouncingEntrance' },
            { animation: 'bounceInLeft', target: 'bouncingEntrance' },
            { animation: 'bounceInRight', target: 'bouncingEntrance' },
            { animation: 'bounceInUp', target: 'bouncingEntrance'  }
        ]
        this.bouncingExits = [
            { animation: 'bounceOut', target: 'bouncingExits' },
            { animation: 'bounceOutDown', target: 'bouncingExits' },
            { animation: 'bounceOutLeft', target: 'bouncingExits' },
            { animation: 'bounceOutRight', target: 'bouncingExits' },
            { animation: 'bounceOutUp', target: 'bouncingExits'  }
        ]
        this.rotatingEntrances = [
            { animation: 'rotateIn', target: 'rotatingEntrances' },
            { animation: 'rotateInDownLeft', target: 'rotatingEntrances' },
            { animation: 'rotateInDownRight', target: 'rotatingEntrances' },
            { animation: 'rotateInUpLeft', target: 'rotatingEntrances' },
            { animation: 'rotateInUpRight', target: 'rotatingEntrances'  }
        ]
        this.rotatingExits = [
            { animation: 'rotateOut', target: 'rotatingExits' },
            { animation: 'rotateOutDownLeft', target: 'rotatingExits' },
            { animation: 'rotateOutDownRight', target: 'rotatingExits' },
            { animation: 'rotateOutUpLeft', target: 'rotatingExits' },
            { animation: 'rotateOutUpRight', target: 'rotatingExits'  }
        ]
        this.fadeingEntrances = [
            { animation: 'fadeIn', target: 'fadeingEntrances' },
            { animation: 'fadeInDown', target: 'fadeingEntrances' },
            { animation: 'fadeInDownBig', target: 'fadeingEntrances' },
            { animation: 'fadeInLeft', target: 'fadeingEntrances' },
            { animation: 'fadeInLeftBig', target: 'fadeingEntrances'  },
            { animation: 'fadeInRight', target: 'fadeingEntrances'  },
            { animation: 'fadeInRightBig', target: 'fadeingEntrances'  },
            { animation: 'fadeInUp', target: 'fadeingEntrances'  },
            { animation: 'fadeInBig', target: 'fadeingEntrances'  }
        ]
        this.fadeingExits = [
            { animation: 'fadeOut', target: 'fadeingExits' },
            { animation: 'fadeOutDown', target: 'fadeingExits' },
            { animation: 'fadeOutDownBig', target: 'fadeingExits' },
            { animation: 'fadeOutLeft', target: 'fadeingExits' },
            { animation: 'fadeOutLeftBig', target: 'fadeingExits'  },
            { animation: 'fadeOutRight', target: 'fadeingExits'  },
            { animation: 'fadeOutRightBig', target: 'fadeingExits'  },
            { animation: 'fadeOutUp', target: 'fadeingExits'  },
            { animation: 'fadeOutUpBig', target: 'fadeingExits'  }
        ]
        this.zoomEntrances = [
            { animation: 'zoomIn', target: 'zoomEntrances' },
            { animation: 'zoomInDown', target: 'zoomEntrances' },
            { animation: 'zoomInLeft', target: 'zoomEntrances' },
            { animation: 'zoomInRight', target: 'zoomEntrances' },
            { animation: 'zoomInUp', target: 'zoomEntrances'  }
        ]
        this.zoomExits = [
            { animation: 'zoomOut', target: 'zoomExits' },
            { animation: 'zoomOutDown', target: 'zoomExits' },
            { animation: 'zoomOutLeft', target: 'zoomExits' },
            { animation: 'zoomOutRight', target: 'zoomExits' },
            { animation: 'zoomOutUp', target: 'zoomExits'  }
        ]

        //Animate    
        this.ca = '';
    
        this.setAnimation = function(animation, target) {
            if (animation === "hinge") {
                animationDuration = 2100;
            }
            else {
                animationDuration = 1200;
            }
            
            angular.element('#'+target).addClass(animation);
            
            $timeout(function(){
                angular.element('#'+target).removeClass(animation);
            }, animationDuration);
        }
    
    })

