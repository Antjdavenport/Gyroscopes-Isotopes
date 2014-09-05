ig.module(
    'game.entities.neutron'
)
.requires(
    'impact.entity',
    'plugins.box2d.entity'
)
.defines(function () {

    EntityNeutron = ig.Box2DEntity.extend({

        particleType: 'neutron',

        size: {

            x: 12,

            y: 12,

            increment: [12, 16, 20, 23, 26, 28, 30]

        },

        mass: [3, 3.5, 4, 4.5, 5, 5.5, 6],

        resizing: false,

        targetSize: {

            x: 12,

            y: 12

        },

        level: 0,

        targetColour: [],

        colourSteps: [],

        flashed: false,

        flashing: false,

        electronBlasting: false,

        electronBlastAvailable: false,

        rotationStep: 0,

        motion: {

            multiplier: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.8]

        },

        // Collision is already handled by Box2D!
        collides: ig.Entity.COLLIDES.NEVER,

        flip: false,

        sounds: {

            death: new ig.Sound('media/sounds/death.ogg'),

            absorb: new ig.Sound('media/sounds/absorb.ogg'),

            decay: new ig.Sound('media/sounds/decay.ogg'),

            electronBlast: new ig.Sound('media/sounds/electron-blast.ogg')

        },

        alpha: 1,

        init: function (x, y, settings) {

            var self = this;

            this.originalColour = [settings.colour[0], settings.colour[1], settings.colour[2]];

            for (var i in this.sounds) {

                if (this.sounds.hasOwnProperty(i)) {

                    this.sounds[i].volume = 0.4;

                }

            }

            this.parent(x, y, settings);

        },

        createBody: function (position) {

            var massData = new b2.MassData();

            this.body = ig.world.CreateBody(this.getBody(position));

            this.body.CreateShape(this.getShape());

            this.body.CreateShape(this.getShape(true));

            massData.mass = this.mass[this.level];

            this.body.SetMass(massData);

            this.body.entity = this;

        },

        getBody: function (position) {

            var particleBody = new b2.BodyDef();

            particleBody.linearDamping = 0.4;

            particleBody.angularDamping = 0.2;

            particleBody.type = b2.Body.b2_dynamicBody;

            if (typeof position !== 'undefined') {

                particleBody.position.Set(
                    position.x,
                    position.y
                );

            } else {

                particleBody.position.Set(
                    (this.pos.x + this.size.x) * b2.SCALE,
                    (this.pos.y + this.size.y) * b2.SCALE
                );

            }

            return particleBody;

        },

        getShape: function (sensor) {

            var shapeDef = new b2.CircleDef();

            if (sensor === true) {

                shapeDef.radius = 100 * b2.SCALE;

                shapeDef.isSensor = true;

                shapeDef.filter.categoryBits = 1;

                shapeDef.filter.maskBits = 2;

                shapeDef.userData = {
                    name: "electronBlastRadius"
                };

            } else {

                shapeDef.radius = this.size.x * b2.SCALE;

                shapeDef.restitution = 1;

                shapeDef.filter.categoryBits = 2;

                shapeDef.filter.maskBits = 1;

                shapeDef.filter.groupIndex = 1;

                shapeDef.userData = {
                    name: "neutron"
                };

            }

            return shapeDef;

        },

        update: function () {

            var thisPosition = this.body.GetPosition(),
                contact,
                position,
                vector;

            if (this.body !== undefined && this.motion.gamma !== undefined && this.motion.beta !== undefined) {

                this.body.ApplyForce(new b2.Vec2(this.motion.beta * this.motion.multiplier[this.level],
                                                -this.motion.gamma * this.motion.multiplier[this.level]),
                                     thisPosition);

            }

            if (this.resizing === true) {

                this.resize();

            }

            if (this.flashing === true) {

                this.flash();

            }

            if (this.electronBlasting === true) {

                vector = new b2.Vec2(0, 0);

                for (contact = this.body.m_contactList; contact !== null; contact = contact.next) {

                    position = contact.other.GetPosition();

                    vector.x = position.x - thisPosition.x;

                    vector.y = position.y - thisPosition.y;

                    ig.game.normaliseVector(vector, 50);

                    contact.other.ApplyImpulse(vector, position);

                }

                this.electronBlasting = false;

            }

            this.parent();

        },

        draw: function () {

            var context = ig.system.context,
                bodyPosition = this.body.GetPosition(),
                position = {
                    x: (bodyPosition.x / b2.SCALE) - ig.game.screen.x,
                    y: (bodyPosition.y / b2.SCALE) - ig.game.screen.y
                };

            context.beginPath();

            context.arc(position.x, position.y, this.size.x, 0, Math.PI * 2, true);

            context.fillStyle = this.getColour();

            context.closePath();

            context.fill();

            if (this.electronBlastAvailable === true) {

                context.save();

                context.translate(position.x, position.y);

                context.rotate(Math.PI * 2 / 100 * this.rotationStep++);

                context.beginPath();

                context.arc(-this.size.x - 8, 0, 4, 0, Math.PI * 2, true);

                context.fillStyle = "#fff";

                context.fill();

                context.closePath();

                context.restore();

                if (this.rotationStep > 100) {

                    this.rotationStep = 0;

                }

            }

            this.parent();

        },

        getColour: function () {

            return 'rgba(' + this.colour.join(',') + ', ' + this.alpha + ')';

        },

        move: function (motion) {

            this.motion.gamma = motion.gamma;

            this.motion.beta = motion.beta;

        },

        /*collideWith: function (other, otherShape, shape) {

            if (this.flashing === false && (shape.m_userData.name === "neutron" && otherShape.m_userData.name !== "electronBlastRadius")) {

                console.log(other.particleType, shape.m_userData.name, otherShape.m_userData.name);

                this.startFlash();

            }

        },*/

        startFlash: function () {

            var duration = 10;

            this.flashing = true;

            this.flashed = false;

            this.targetColour = [255, 255, 255];

            this.colourSteps = [(this.targetColour[0] - this.colour[0]) / duration,
                                (this.targetColour[1] - this.colour[1]) / duration,
                                (this.targetColour[2] - this.colour[2]) / duration];

        },

        stopFlash: function () {

            var duration = 50;

            this.targetColour = this.originalColour;

            this.colourSteps = [(this.targetColour[0] - this.colour[0]) / duration,
                                (this.targetColour[1] - this.colour[1]) / duration,
                                (this.targetColour[2] - this.colour[2]) / duration];

        },

        flash: function () {

            var i,
                j;

            for (i = 0, j = this.colourSteps.length; i < j; i++) {

                this.colour[i] *= 10;
                this.colour[i] += (this.colourSteps[i] * 10);
                this.colour[i] /= 10;

                if (this.flashed === true) {

                    this.colour[i] = Math.floor(this.colour[i]);

                    if (this.colour[i] < this.targetColour[i]) {

                        this.colour[i] = this.targetColour[i];

                    }

                } else {

                    this.colour[i] = Math.ceil(this.colour[i]);

                    if (this.colour[i] > this.targetColour[i]) {

                        this.colour[i] = this.targetColour[i];

                    }

                }

            }

            if (this.colour[0] === this.targetColour[0]) {

                if (this.flashed === false) {

                    this.flashed = true;

                    this.stopFlash();

                } else {

                    this.flashing = false;

                }

            }

        },

        absorb: function () {

            if (this.level < 6) {

                this.level++;

                $('#' + this.id).find('.value').text(this.level + 1);

                this.targetSize = {
                    x: this.size.increment[this.level],
                    y: this.size.increment[this.level],
                    increment: 0.2
                };

                this.sounds.absorb.play();

                this.resizing = true;

                if (this.level === 6) {

                    console.log("ELECTRON BLAST AVAILABLE!");

                    manager.electronBlastStatus(this.id, true);

                    this.electronBlastAvailable = true;

                }

            }

        },

        decay: function () {

            if (this.level > 0) {

                this.level--;

                $('#' + this.id).find('.value').text(this.level + 1);

                this.targetSize = {
                    x: this.size.increment[this.level],
                    y: this.size.increment[this.level],
                    increment: 0.2
                };

                this.sounds.decay.play();

                this.resizing = true;

                if (this.level < 6 && this.electronBlastAvailable === true) {

                    console.log("ELECTRON BLAST LOST!");

                    manager.electronBlastStatus(this.id, false);

                    this.electronBlastAvailable = false;

                }

            }

        },

        resize: function () {

            var velocity = this.body.GetLinearVelocity(),
                position = this.body.GetPosition();

            if (this.size.x < this.targetSize.x) {

                this.size.x *= 10;
                this.size.x += (this.targetSize.increment * 10);
                this.size.x /= 10;

                this.size.y *= 10;
                this.size.y += (this.targetSize.increment * 10);
                this.size.y /= 10;

            } else {

                this.size.x *= 10;
                this.size.x -= (this.targetSize.increment * 10);
                this.size.x /= 10;

                this.size.y *= 10;
                this.size.y -= (this.targetSize.increment * 10);
                this.size.y /= 10;

            }

            ig.world.DestroyBody(this.body);

            this.createBody(position);

            this.body.SetLinearVelocity(velocity);

            if (this.size.x === this.targetSize.x) {

                this.size.x = parseInt(this.size.x, 10);

                this.size.y = parseInt(this.size.y, 10);

                this.resizing = false;

            }

        },

        electronBlast: function () {

            if (this.electronBlastAvailable === true) {

                console.log("ELECTRON BLASTED!");

                this.sounds.electronBlast.play();

                this.level = 0;

                this.targetSize = {
                    x: this.size.increment[this.level],
                    y: this.size.increment[this.level],
                    increment: 0.5
                };

                this.resizing = true;

                this.electronBlasting = true;

                this.electronBlastAvailable = false;

                manager.electronBlastStatus(this.id, false);

                manager.stats.electrons++;

            }

        }

    });

});