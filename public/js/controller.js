/*global requirejs*/

requirejs.config({
    paths: {
        jquery: "components/jquery/jquery",
        handlebars: "components/handlebars/handlebars.runtime",
        templates: "templates/templates",
        io: "plugins/socket.io",
        ga: "//google-analytics.com/ga"
    },
    shim: {
        handlebars: {
            exports: "Handlebars"
        },
        ga: {
            exports: "_gaq"
        },
        io: {
            exports: "io"
        }
    }
});

requirejs(["jquery", "io", "templates", "modules/analytics", "utilities/log"], function ($, io, templates, analytics) {

    var main = {

        player: {

            name: localStorage["name"],

            labId: config.labId

        },

        screen: {

            width: $(window).width(),

            height: $(window).height(),

            centre: {

                x: $(window).width() / 2,

                y: $(window).height() / 2

            }

        },

        touchMoved: false,

        $container: $("#container"),

        init: function () {

            if ((Modernizr.touch === false || (Modernizr.devicemotion === false && Modernizr.deviceorientation === false)) && config.debug === false) {

                console.log("Gyroscope not detected!");

                this.loadView("error", {

                    type: "error",

                    message: "Gyroscope not detected, experiment aborted."

                });

                return false;

            }

            console.log(this.player);

            this.bindEvents();

            this.connectSocket();

            if (typeof this.player.name !== "string") {

                this.loadView("registration");

            } else {

                this.register();

            }

            analytics.init();

            console.log('Main initiated: ', this);

        },

        connectSocket: function () {

            this.socket = io.connect('//' + location.hostname + ":" + location.port);

            this.bindSocketEvents();

        },

        bindEvents: function () {

            var self = this;

            $(window).on('touchmove', function () {

                self.touchMoved = true;

            }).on('touchend', function () {

                self.touchMoved = false;

            });

            $(document).on("webkitvisibilitychange", function (e) {

                if (document.webkitHidden === true) {

                    self.socket.close();

                } else {

                    self.connectSocket();

                }

            });

        },

        resizeContainer: function () {

            this.$container.css({
                position: "absolute",
                left: this.screen.width,
                width: this.screen.height,
                height: this.screen.width
            });

        },

        setName: function (name) {

            this.player.name = name;

            localStorage["name"] = name;

        },

        register: function () {

            var self = this;

            this.socket.emit("registration", {

                type: 'player',

                player: self.player

            });

        },

        enterLobby: function () {

            if (this.player.ready === true) {

                this.loadView("waiting");

            } else {

                this.loadView("lobby");

            }

        },

        enterGame: function () {

            var self = this;

            this.loadView("game", {}, function () {

                $('#player').css('background', self.getColour());

                self.motion.init();

                // self.startAnimation();

            });

        },

        playerReady: function () {

            this.player.ready = true;

            this.socket.emit("ready", {

                player: this.player

            });

            this.loadView("waiting");

        },

        playerCancelled: function () {

            this.player.ready = false;

            this.socket.emit("cancelled", {

                player: this.player

            });

            this.enterLobby();

        },

        playerReset: function () {

            this.player.ready = false;

        },

        bindSocketEvents: function () {

            var self = this;

            self.socket.on('message', function (response) {

                console.log('Message: ', response.message, response.type, response);

                if (response.type === 'registration') {

                    self.player = response.data.player;

                    // if the lab is in game, the player should be shown a waiting screen

                    if (response.data.view === "game") {

                        self.enterGame();

                    } else if (response.data.view === "lobby") {

                        self.enterLobby();

                    }

                } else if (response.type === "error") {

                    self.loadView("error", response);

                } else {

                    self.loadView("message", response);

                }

            });

            self.socket.on("status", function (response) {

                if (response.data.state === "game") {

                    self.enterGame();

                } else if (response.data.state === "lobby") {

                    self.playerReset();

                    self.enterLobby();

                }

                console.log("Status update from lab: ", response);

            });

            self.socket.on("electronBlastStatus", function (payload) {

                console.log("Electron blast status: ", payload.data);

                if (payload.data === true) {

                    $("#electron-blast").removeClass("inactive");

                } else {

                    $("#electron-blast").addClass("inactive");

                }

            });

        },

        bindViewEvents: function (view) {

            var self = this;

            switch (view) {

                case "registration":

                    $('#name-button').on('touchstart', function () {

                        $(this).addClass('active');

                    }).on('touchend', function () {

                        $(this).removeClass('active');

                    });

                    $('#name-form').on('submit', function (e) {

                        e.preventDefault();

                        var name = $(this).find("#name-input").val();

                        self.setName(name);

                        self.register();

                        return false;

                    });

                break;

                case "lobby":

                    self.resizeContainer();

                    $('#ready-button').on('touchstart', function () {

                        $(this).addClass('active');

                    }).on('touchend', function () {

                        $(this).removeClass('active');

                        if (self.touchMoved === false) {

                            self.playerReady();

                        }

                    });

                    $(window).off('deviceorientation MozOrientation');

                break;

                case "waiting":

                    self.resizeContainer();

                    $('#cancel-button').on('touchstart', function () {

                        $(this).addClass('active');

                    }).on('touchend', function () {

                        $(this).removeClass('active');

                        if (self.touchMoved === false) {

                            self.playerCancelled();

                        }

                    });

                break;

                case "game":

                    self.resizeContainer();

                    $(window).on('deviceorientation MozOrientation', function (e) {

                        e = e.originalEvent;

                        var beta = Math.round(e.beta),
                            gamma = Math.round(e.gamma);

                        self.motion.current = {

                            beta: beta,

                            gamma: gamma

                        };

                    });

                    $("#electron-blast").on('touchstart', function () {

                        $(this).addClass('active');

                    }).on('touchend', function () {

                        var $this = $(this).removeClass('active');

                        if (self.touchMoved === false) {

                            if ($this.hasClass("inactive") === false) {

                                self.socket.emit("electronBlast", {

                                    player: self.player

                                });

                                $this.addClass("inactive");

                            }

                        }

                    });

                break;

            }

        },

        loadView: function (view, data, callback) {

            var html;

            data = data || {};

            html = templates[view](data);

            this.$container.removeClass().addClass(view).html(html);

            this.bindViewEvents(view);

            if (typeof callback === "function") {

                callback();

            }

        },

        motion: {

            current: {

                beta: 0,

                gamma: 0

            },

            previous: {

                beta: 0,

                gamma: 0

            },

            init: function () {

                this.start();

            },

            start: function () {

                var self = this;

                self.motionInterval = setInterval(function () {

                    if (self.current.beta !== self.previous.beta && self.current.gamma !== self.previous.gamma) {

                        self.previous = self.current;

                        self.send();

                    }

                }, 400);

            },

            stop: function () {

                clearInterval(this.motionInterval);

            },

            send: function () {

                var self = this;

                main.socket.emit('motion', {

                    player: main.player,

                    motion: self.current

                });

            }

        },

        getRandomNumber: function (min, max) {

            return parseInt((Math.random() * (max - min)) + min, 10);

        },

        getColour: function () {

            return 'rgb(' + this.player.colour.join(',') + ')';

        }

    };

    $(document).ready(function () {

        main.init();

    });

});