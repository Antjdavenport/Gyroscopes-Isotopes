ig.module(
    "game.manager"
)
.requires(
    "game.main",
    "game.connections",
    "plugins.templates",
    "plugins.jquery-qrcode",
    "plugins.jquery-countdown"
)
.defines(function () {

    manager = {

        players: {},

        dimensions: {

            width: $(window).width(),

            height: $(window).height()

        },

        stats: {

            consumed: 0,

            negatrons: 0,

            positrons: 0,

            electrons: 0,

            start: 0,

            end: 0,

            duration: 0

        },

        view: "connecting",

        init: function () {

            connections.init();

            console.log("Manager initialised: ", config);

        },

        bindViewEvents: function (view) {

            var self = this;

            switch (view) {

                case "lobby":

                    $("#start-experiment").on("click", function (e) {

                        e.preventDefault();

                        self.countdown.stop();

                        self.loadGame();

                        return false;

                    });

                break;

            }

        },

        startGame: function () {

            // var dimensions = {
            //         width: 800,
            //         height: 600
            //     },
            //     devicePixelRatio = window.devicePixelRatio || 1,
            //     $canvas = $("#canvas"),
            //     context;

            // if (devicePixelRatio > 1) {
            //     $canvas.css(dimensions);
            //     ig.main('#canvas', Prototype, 60, dimensions.width * devicePixelRatio, dimensions.height * devicePixelRatio, 2);
            //     context = $canvas[0].getContext('2d');
            //     context.scale(devicePixelRatio, devicePixelRatio);
            // } else {
            //     ig.main('#canvas', Prototype, 60, dimensions.width, dimensions.height, 1);
            // }

            ig.main('#canvas', Prototype, 60, 800, 600, 1);

            this.stats.start = Date.now();

        },

        resetPlayers: function () {

            // set all players to alive and not ready

            for (var i in this.players) {

                if (this.players.hasOwnProperty(i)) {

                    this.players[i].alive = true;

                    this.players[i].ready = false;

                }

            }

        },

        countPlayers: function () {

            return Object.keys(this.players).length;

        },

        generateControllerQrCode: function () {

            // Generate QR Code that links to controller URL
            var $qrCode = $("#qrcode"),
                devicePixelRatio = window.devicePixelRatio || 1,
                dimensions = 140,
                width,
                height;

            width = height = dimensions * devicePixelRatio;

            $qrCode.qrcode({

                width: width,

                height: height,

                text: $qrCode.data("href")

            });

            $qrCode.find("canvas").css({

                width: dimensions,

                height: dimensions

            });

            console.log("Generated controller QR Code: ", $qrCode.data("href"));

        },

        countdown: {

            started: false,

            start: function () {

                $("#or").addClass("hidden");

                if (this.started === true) {

                    $("#countdown").removeClass("hidden").data("countdown").restart();

                } else {

                    this.started = true;

                    $("#countdown").removeClass("hidden").countdown(function () {

                        manager.loadGame();

                    });

                    $("#or").addClass("hidden");

                }

            },

            stop: function () {

                if (this.started === true) {

                    $("#countdown").addClass("hidden").data("countdown").stop();

                    $("#or").removeClass("hidden");

                }

            },

            reset: function () {

                if (this.started === true) {

                    $("#countdown").addClass("hidden").data("countdown").reset();

                    $("#or").removeClass("hidden");

                }

            }

        },

        setPlayers: function (players) {

            this.players = players;

        },

        loadLobby: function () {

            var self = this,
                data;

            this.resetPlayers();

            data = {
                players: this.players
            };

            $.extend(data, config);

            this.loadView("lobby", data, function () {

                self.generateControllerQrCode();

            });

            console.log("Loading lobby.");

        },

        loadError: function (error) {

            this.loadView("error", {

                message: error

            });

        },

        loadGame: function () {

            var self = this,
                data = {

                players: self.players,

                labId: config.labId

            };

            this.loadView("game", data, function () {

                self.startGame();

            });

            console.log("Loading game.");

        },

        loadView: function (view, data, callback) {

            var html = Handlebars.templates[view](data);

            console.log("Handlebars templates: ", Handlebars.templates);

            $('#container').removeClass().addClass(view).html(html);

            this.bindViewEvents(view);

            this.view = view;

            if (view !== "error" && view !== "gameover") {

                connections.updateStatus(view);

            }

            if (typeof callback === "function") {

                callback();

            }

            console.log("View loaded: ", view, data);

        },

        addPlayer: function (player) {

            var html = Handlebars.templates[this.view + ".player"](player);

            $("#players").append(html);

            if (this.view === "game") {

                ig.game.neutrons.add(player);

            }

            this.players[player.id] = player;

        },

        removePlayer: function (player) {

            delete this.players[player.id];

            if (this.view === "game") {

                ig.game.neutrons.remove(player);

                this.checkGameFinished();

            } else if (this.view === "lobby") {

                $("#" + player.id).remove();

                this.countdown.reset();

            }

        },

        killPlayer: function (id) {

            var player = this.players[id];

            player.alive = false;

            connections.killPlayer(player);

            this.checkGameFinished();

            console.log('Player killed: ', player);

        },

        playerReady: function (player) {

            if (this.view === "lobby") {

                $("#" + player.id).addClass("ready");

                this.players[player.id].ready = true;

                if (this.playersReady()) {

                    this.countdown.start();

                }

            }

        },

        playersReady: function () {

            if (this.countPlayers() > 1) {

                var ready = true;

                for (var i in this.players) {

                    if (this.players[i].ready === false) {

                        ready = false;

                        break;

                    }

                }

                return ready;

            } else {

                return false;

            }

        },

        playerCancelled: function (player) {

            if (this.view === "lobby") {

                $("#" + player.id).removeClass("ready");

                this.players[player.id].ready = false;

                this.countdown.reset();

            }

        },

        checkGameFinished: function () {

            var playerCount = this.countPlayers(),
                alivePlayers = this.countAlivePlayers();

            if (playerCount < 2 || alivePlayers < 2) {

                this.endGame();

            }

        },

        getWinner: function () {

            console.log("Players: ", this.players);

            for (var i in this.players) {

                if (this.players.hasOwnProperty(i)) {

                    if (this.players[i].alive === true) {

                        return this.players[i];

                    }

                }

            }

        },

        endGame: function () {

            var self = this,
                winner = this.getWinner(),
                data;

            ig.system.stopRunLoop();

            ig.music.stop();

            this.stats.end = Date.now();

            this.stats.duration = (this.stats.end - this.stats.start) / 1000;

            console.log("Game ended: ", winner);

            if (typeof winner === "undefined") {

                window.location.reload();

            } else {

                connections.alertWinner(winner);

                data = {
                    winner: winner,
                    stats: this.stats
                };

                console.log("Final screen data: ", data);

                this.loadView("gameover", data);

                setTimeout(function () {

                    window.location.reload();

                }, 15000);

            }

        },

        countAlivePlayers: function () {

            var count = 0;

            for (var i in this.players) {

                if (this.players.hasOwnProperty(i)) {

                    if (this.players[i].alive === true) {

                        count++;

                    }

                }

            }

            return count;

        },

        electronBlastStatus: function (id, data) {

            var player = this.players[id];

            connections.emit("electronBlastStatus", {

                player: player,

                data: data

            });

        },

        resetStats: function () {

            var i;

            for (i in this.stats) {

                if (this.stats.hasOwnProperty(i)) {

                    this.stats[i] = 0;

                }

            }

        }

    };

    manager.init();

});