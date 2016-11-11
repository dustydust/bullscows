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


    .service('getgamedialogService', ['$resource', function($resource) {
        this.getDialog = function(type, text) {
            var dList = $resource("data/gamedialog.json");
            
            return dList.get({
                type: type,
                text: text
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
