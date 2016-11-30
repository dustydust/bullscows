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
        //Get Recent Game Dialog
        $scope.textMessage = '';

        $scope.gdResultGuesses      = getGuessesbyidService.getGuesses( { gameid: $scope.gameid } );
        $scope.gdResultGameStatus   = getGameStatusbyidService.getGame( { gameid: $scope.gameid } );
        $scope.gdResultBestGuesses  = getBestGuessesbyidService.getGuesses( { gameid: $scope.gameid, limit: 5 } );
        $scope.gdResultZeroGuesses  = getZeroGuessesbyidService.getGuesses( { gameid: $scope.gameid, limit: 5 } );

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
                            $scope.gdResultGuesses.guesses.push({ word: '"' + firstSymbol + '"' + ' is here' });
                        }
                        else
                        {
                            $scope.gdResultGuesses.guesses.push({ word: '"' + firstSymbol + '"' + ' isn\'t here' });
                        }
                        $('.mbl-messages').mCustomScrollbar('scrollTo',$(document).find('#mCSB_2_container').height());
                    });
                    $scope.textMessage = '';
                }
                else if ($scope.textMessage.length == $scope.gdResultGameStatus.game.secret.length)
                {
                    var guess = new Guess($scope.textMessage, $scope.gameid);
                    guess.create().then(function() {
                        console.log(guess);
                        if (guess.answer.data.guess.exact)
                        {
                            $scope.gdResultGuesses.guesses.push(guess.answer.data.guess);
                            $scope.gdResultGuesses.guesses.push({ word: 'Congratulations! You write the correct word!' });
                            $('.mbl-messages').mCustomScrollbar('scrollTo',$(document).find('#mCSB_2_container').height());
                        }
                        else
                        {
                            $scope.gdResultGuesses.guesses.push(guess.answer.data.guess);
                            $('.mbl-messages').mCustomScrollbar('scrollTo',$(document).find('#mCSB_2_container').height());
                        }
                        
                    });
                    $scope.textMessage = '';
                    $scope.gdResultGameStatus   = getGameStatusbyidService.getGame( { gameid: $scope.gameid } );
                    $scope.gdResultBestGuesses  = getBestGuessesbyidService.getGuesses( { gameid: $scope.gameid, limit: 5 } );
                    $scope.gdResultZeroGuesses  = getZeroGuessesbyidService.getGuesses( { gameid: $scope.gameid, limit: 5 } );
                    
                }

            }
        }

        this.stopGame = function() {
            var game = new Game(false, $scope.gameid);
            game.stop().then(function() {
                $location.path('/home');
            });
        }
    })

    .controller('gamelistCtrl', function($scope, getGamelistService){
        //Get Recent Game Dialog
        $scope.textMessage = '';

        $scope.gdResult = getGamelistService.getGames();

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

