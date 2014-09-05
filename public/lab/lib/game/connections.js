ig.module(
    "game.connections"
)
.requires(
    // "plugins.socket-io"
)
.defines(function () {

    connections = {

        init: function () {

            this.connectSocket();

            this.bindSocketEvents();

            this.registerLab();

            console.log("Connections initialised: ", this);

        },

        connectSocket: function () {

            this.socket = io.connect('//' + location.hostname + ":" + location.port);

        },

        registerLab: function () {

            this.socket.emit("registration", {

                type: "lab",

                lab: {

                    id: config.labId

                }

            });

        },

        bindSocketEvents: function () {

            var self = this,
                i,
                html,
                player;

            self.socket.on("message", function (response) {

                console.log("Message: ", response.message, response);

                switch (response.type) {

                    case "registration":

                        // is server unique
                        if (response.data.successful) {

                            manager.setPlayers(response.data.players);

                            manager.loadLobby();

                        } else {

                            manager.loadView("error", {message: response.message});

                        }

                    break;

                    case "playerJoined":

                        player = response.data;

                        manager.addPlayer(player);

                    break;

                    case "playerReady":

                        player = response.data;

                        manager.playerReady(player);

                    break;

                    case "playerCancelled":

                        player = response.data;

                        manager.playerCancelled(player);

                    break;

                    case "playerLeft":

                        player = response.data;

                        manager.removePlayer(player);

                    break;

                    case "playerResurrect":

                        player = response.data;

                        manager.resurrectPlayer(player);

                    break;

                }

            });

            self.socket.on("motion", function (data) {

                if (ig.game !== undefined && ig.game.neutrons[data.player.id] !== undefined) {

                    ig.game.neutrons[data.player.id].move(data.motion);

                }

            });

            self.socket.on("electronBlast", function (data) {

                if (ig.game !== undefined && ig.game.neutrons[data.player.id] !== undefined) {

                    ig.game.neutrons[data.player.id].electronBlast();

                }

            });

        },

        updateStatus: function (view) {

            this.socket.emit("status", {
                data: {
                    state: view,
                    labId: config.labId
                }
            });

        },

        alertWinner: function (player) {

            console.log("Alerting winner: ", player);

            this.socket.emit("winner", {

                player: player

            });

        },

        killPlayer: function (player) {

            this.socket.emit("killed", {

                player: player

            });

        },

        emit: function (topic, payload) {

            this.socket.emit(topic, payload);

        }

    };

});