ig.module(
    'game.entities.particle'
)
.requires(
    'impact.entity',
    'plugins.box2d.entity'
)
.defines(function () {

    EntityParticle = ig.Box2DEntity.extend({

        size: {

            x: 6,

            y: 6

        },

        force: {

            min: 25,

            max: 50

        },

        // Collision is already handled by Box2D!
        collides: ig.Entity.COLLIDES.NEVER,

        flip: false,

        sounds: {

            collision: new ig.Sound('media/sounds/collision.ogg')

        },

        colour: [],

        //custom
        fadeOut: false,

        maxAlpha: 1,

        alpha: 0,

        alphaIncrement: 0.06,

        threshold: 4,

        blackholePull: false,

        blackholePullApplied: false,

        init: function (x, y, settings) {

            this.sounds.collision.volume = 0.1;

            this.parent(x, y, settings);

        },

        createBody: function () {

            var particleBody = new b2.BodyDef(),
                shapeDef = new b2.CircleDef(),
                massData = new b2.MassData();

            particleBody.linearDamping = 0.4;

            particleBody.angularDamping = 0.2;

            particleBody.position.Set(
                (this.pos.x + this.size.x) * b2.SCALE,
                (this.pos.y + this.size.y) * b2.SCALE
            );

            this.body = ig.world.CreateBody(particleBody);

            shapeDef.radius = this.size.x * b2.SCALE;

            massData.mass = 2;

            shapeDef.restitution = 1;

            shapeDef.filter.categoryBits = 2;

            shapeDef.filter.maskBits = 1;

            shapeDef.filter.groupIndex = 1;

            this.body.CreateShape(shapeDef);

            this.body.SetMass(massData);

        },

        update: function () {

            this.body.ApplyForce(ig.game.getRandomVectorMinMax(this.force.min, this.force.max), this.body.GetPosition());

            if (this.fadeOut === true) {

                if (this.alpha > this.alphaIncrement) {

                    this.alpha -= this.alphaIncrement;

                } else {

                    this.alpha = 0;

                    this.removeParticle();

                }

            } else {

                if (this.alpha < this.maxAlpha) {

                    this.alpha += this.alphaIncrement;

                } else {

                    this.alpha = this.maxAlpha;

                }

            }

            this.parent();

        },

        draw: function () {

            var context = ig.system.context,
                _screen = ig.game.screen;

            context.beginPath();

            context.arc(this.pos.x - _screen.x + (this.size.x / 2), this.pos.y - _screen.y + (this.size.y / 2), this.size.x, 0, Math.PI * 2, false);

            context.fillStyle = this.getColour();

            context.closePath();

            context.fill();

            this.parent();

        },

        collideWith: function (other, otherShape) {

            var self = this;

            if (other.particleType === "neutron" && otherShape.m_userData.name === "neutron" && self.fadeOut === false) {

                other.startFlash();

                // this.sounds.collision.play();

                self.processCollision(other, otherShape);

            }

            this.parent();

        },

        processCollision: function (other, otherShape) {

            this.fadeOut = true;

        },

        getColour: function () {

            return 'rgba(' + this.colour.join(',') + ', ' + this.alpha + ')';

        },

        removeParticle: function () {

            ig.game[this.particleType + "s"].remove(this.id);

        },

        isInBounds: function () {

            if (this.pos.x > this.size.x * 2 &&
                this.pos.y > this.size.y * 2 &&
                this.pos.x < ig.system.canvas.width &&
                this.pos.y < ig.system.canvas.height) {

                return true;

            } else {

                return false;

            }

        }

    });

});