ig.module(
    'game.main'
)
.requires(
    'impact.game',
    'plugins.box2d.game',
    'plugins.box2d.collisions',
    'game.entities.neutron',
    'game.entities.positron',
    'game.entities.negatron',
    'game.entities.dust',
    'game.entities.blackhole',
    'game.levels.main',
    'plugins.box2d.debug'
)
.defines(function () {

    Prototype = ig.Box2DGame.extend({

        clearColor: '#222222',

        map: [],

        neutrons: {

            count: 0,

            add: function (player) {

                var game = ig.game,
                    position = this.getStartPosition();

                this[player.id] = game.spawnEntity(
                    EntityNeutron,
                    position.x + game.screen.x,
                    position.y + game.screen.y,
                    player
                );

                this.count++;

            },

            addMultiple: function (players) {

                for (var i in players) {

                    if (players.hasOwnProperty(i)) {

                        ig.game.neutrons.add(players[i]);

                    }

                }

            },

            kill: function (id) {

                manager.killPlayer(id);

                this[id].kill();

                this.count--;

            },

            remove: function (player) {

                this[player.id].kill();

                this.count--;

            },

            getStartPosition: function () {

                var blackhole = ig.game.blackhole,
                    position = {

                        x: ig.game.getRandomNumber(0, ig.system.width - 24),

                        y: ig.game.getRandomNumber(0, ig.system.height - 24)

                    };

                while (position.x > (blackhole.body.GetPosition().x / b2.SCALE) - 120 - 24 &&
                       position.x < (blackhole.body.GetPosition().x / b2.SCALE) + 120 &&
                       position.y > (blackhole.body.GetPosition().y / b2.SCALE) - 120 - 24 &&
                       position.y < (blackhole.body.GetPosition().y / b2.SCALE) + 120) {

                    position = {

                        x: ig.game.getRandomNumber(0, ig.system.width - 24),

                        y: ig.game.getRandomNumber(0, ig.system.height - 24)

                    };

                }

                return position;

            }

        },

        negatrons: {

            total: 10,

            count: 0,

            counter: 0,

            add: function () {

                var game = ig.game,
                    negatron = {

                        id: 'negatron_' + this.counter

                    },
                    position = ig.game.getRandomPosition();

                this[negatron.id] = game.spawnEntity(EntityNegatron, position.x, position.y, negatron);

                this.count++;

                this.counter++;

            },

            remove: function (id) {

                this[id].kill();

                this.count--;

            },

            check: function () {

                while (this.count < this.total) {

                    this.add();

                }

                ig.game.sortEntitiesDeferred();

            }

        },

        positrons: {

            total: 10,

            count: 0,

            counter: 0,

            add: function () {

                var game = ig.game,
                    positron = {

                        id: 'positron_' + this.counter

                    },
                    position = ig.game.getRandomPosition();

                this[positron.id] = game.spawnEntity(EntityPositron, position.x, position.y, positron);

                this.count++;

                this.counter++;

            },

            remove: function (id) {

                this[id].kill();

                this.count--;

            },

            check: function () {

                while (this.count < this.total) {

                    this.add();

                }

                ig.game.sortEntitiesDeferred();

            }

        },

        dusts: {

            total: 450,

            count: 0,

            counter: 0,

            add: function () {

                var game = ig.game,
                    dust = {

                        id: 'dust_' + this.counter,

                        maxAlpha: ig.game.getRandomNumber(0.2, 1)

                    },
                    position = ig.game.getRandomPosition();

                this[dust.id] = game.spawnEntity(EntityDust, position.x, position.y, dust);

                this[dust.id].zIndex = -1;

                this.count++;

                this.counter++;

            },

            remove: function (id) {

                this[id].kill();

                this.count--;

            },

            check: function () {

                while (this.count < this.total) {

                    this.add();

                }

                ig.game.sortEntitiesDeferred();

            }

        },

        calculateParticleCount: function () {

            // 1 per 250px2
            var density = 250,
                area = ig.system.width * ig.system.height,
                count = Math.round(area / (density * density));

            this.negatrons.total = this.positrons.total = count;

        },

        getRandomPosition: function () {

            var padding = 20,
                width = {
                    min: padding,
                    max: ig.system.width - padding
                },
                height ={
                    min: padding,
                    max: ig.system.height - padding
                };

            return {

                x: (Math.random() * (width.max - width.min)) + width.min,

                y: (Math.random() * (height.max - height.min)) + height.min

            };

        },

        getRandomNumber: function (min, max) {

            return (Math.random() * (max - min)) + min;

        },

        getRandomVector: function (max) {

            return new b2.Vec2(this.getRandomNumber(0, max) * this.getRandomScale(),
                               this.getRandomNumber(0, max) * this.getRandomScale());

        },

        getRandomVectorMinMax: function (min, max) {

            return new b2.Vec2(this.getRandomNumber(min, max) * this.getRandomScale(),
                               this.getRandomNumber(min, max) * this.getRandomScale());

        },

        getRandomScale: function () {

            return (Math.random() < 0.5) ? 1 : -1;

        },

        normaliseVector: function (vector, value) {

            var ratio,
                direction;

            value = value || 50;

            if (Math.abs(vector.x) > Math.abs(vector.y)) {

                ratio = vector.x / vector.y;

                direction = (vector.x > 0) ? 1 : -1;

                vector.x = value * direction;

                vector.y = vector.x / ratio;

            } else {

                ratio = vector.y / vector.x;

                direction = (vector.y > 0) ? 1 : -1;

                vector.y = value * direction;

                vector.x = vector.y / ratio;

            }

        },

        generateMap: function (width, height, tileSize) {

            var map,
                i,
                row,
                x;

            width = (width / tileSize) + 2,
            height = (height / tileSize) + 2,
            map = {
                "entities": [],
                "layer": [{
                    "name": "collision",
                    "width": width,
                    "height": height,
                    "linkWithCollision": false,
                    "visible": 1,
                    "tilesetName": "",
                    "repeat": false,
                    "preRender": false,
                    "distance": 1,
                    "tilesize": tileSize,
                    "foreground": false,
                    "data": []
                }]
            };

            for (i = 0; i < height; i++) {

                row = [];

                for (x = 0; x < width; x++) {

                    if (i === 0 || i === height - 1 || x === 0 || x === width - 1) {

                        row.push(1);

                    } else {

                        row.push(0);

                    }

                }

                map.layer[0].data.push(row);

            }

            return map;

        },

        generateBoundingBox: function (width, height, size) {

            var worldBoundingBox = new b2.AABB(),
                gravity = new b2.Vec2(0, this.gravity * b2.SCALE);

            worldBoundingBox.lowerBound.Set(0, 0);

            worldBoundingBox.upperBound.Set(
                (width + 100 + (size * 2)) * b2.SCALE,
                (height + 100 + (size * 2)) * b2.SCALE
            );

            ig.world = new b2.World(worldBoundingBox, gravity, true);

            var walls = [
                    {
                        width: width,
                        height: size,
                        x: size,
                        y: 0
                    },
                    {
                        width: size,
                        height: height,
                        x: width + size,
                        y: size
                    },
                    {
                        width: width,
                        height: size,
                        x: size,
                        y: height + size
                    },
                    {
                        width: size,
                        height: height,
                        x: 0,
                        y: size
                    }
                ],
                i,
                j;

            for (i = 0, j = walls.length; i < j; i++) {

                var bodyDef = new b2.BodyDef(),
                    body,
                    shape;

                bodyDef.position.Set(
                    (walls[i].x + (walls[i].width / 2)) * b2.SCALE,
                    (walls[i].y + (walls[i].height / 2)) * b2.SCALE
                );

                body = ig.world.CreateBody(bodyDef);

                shape = new b2.PolygonDef();

                shape.SetAsBox(
                    (walls[i].width / 2) * b2.SCALE,
                    (walls[i].height / 2) * b2.SCALE
                );

                body.CreateShape(shape);

            }

        },

        init: function () {

            var boundingShapeSize = 10,
                random;

            this.generateBoundingBox(ig.system.width, ig.system.height, boundingShapeSize);

            // this.loadLevel(map);

            this.screen.x = this.screen.y = boundingShapeSize;

            this.centre = {

                x: (ig.system.width / 2) + (this.screen.x * 2),

                y: (ig.system.height / 2) + (this.screen.y * 2)

            };

            ig.music.add('media/sounds/blackhole.ogg');

            ig.music.volume = 0.2;

            ig.music.play();

            random = {

                x: this.getRandomNumber(2 + 120, ig.system.width - 2 - 120),

                y: this.getRandomNumber(2 + 120, ig.system.height - 2 - 120)

            };

            this.blackhole = this.spawnEntity(EntityBlackhole, random.x + this.screen.x, random.y + this.screen.y);

            this.neutrons.addMultiple(manager.players);

            // this.calculateParticleCount();

            // Create the "scaler", pluses overlay
            var data = [[1]];

            this.bg = new ig.BackgroundMap(100, data, 'media/images/scaler.png');

            this.bg.repeat = true;

            this.bg.foreground = true;

            // enable box2d debug drawer
            // this.debugDrawer = new ig.Box2DDebug(ig.world);

            this.setupListeners();

        },

        setupListeners: function () {

            var listener = new b2.ContactListener();

            listener.Add = function(point){

                var shape1 = point.shape1,
                    shape2 = point.shape2,
                    a = shape1.GetBody().entity,
                    b = shape2.GetBody().entity;

                if (!a || !b)  return;

                a.collideWith(b, shape2, shape1);
                b.collideWith(a, shape1, shape2);

            };

            ig.world.SetContactListener(listener);

        },

        update: function () {

            this.positrons.check();

            this.negatrons.check();

            this.dusts.check();

            // Update all entities and backgroundMaps
            this.parent();

        },

        draw: function () {


            // Draw all entities and backgroundMaps
            this.parent();

            // draw the scale lines (pluses)
            this.bg.draw();

            // this.debugDrawer.draw();

        }

    });

});