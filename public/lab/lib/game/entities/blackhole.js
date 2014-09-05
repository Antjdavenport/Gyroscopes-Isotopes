ig.module(
    'game.entities.blackhole'
)
.requires(
    'impact.entity',
    'plugins.box2d.entity'
)
.defines(function () {

    EntityBlackhole = ig.Box2DEntity.extend({

        particleType: 'blackhole',

        size: {

            x: 4,

            y: 4,

            max: 60,

            increment: 0.02

        },

        debugSwitch: false,

        // Collision is already handled by Box2D!
        collides: ig.Entity.COLLIDES.NEVER,

        flip: false,

        // custom
        color: [0, 0, 0],

        alpha: 1,

        init: function (x, y, settings) {

            this.parent(x, y, settings);

        },

        categoryBits: 1,

        maskBits: 2,

        createBody: function () {

            var blackholeBody = new b2.BodyDef(),
                shapeDef = new b2.CircleDef(),
                eventHorizon = new b2.CircleDef();

            blackholeBody.position.Set(
                (this.pos.x + this.size.x) * b2.SCALE,
                (this.pos.y + this.size.y) * b2.SCALE
            );

            this.body = ig.world.CreateBody(blackholeBody);

            shapeDef.radius = this.size.x * b2.SCALE;

            shapeDef.isSensor = true;

            shapeDef.userData = {
                name: "blackhole"
            };

            shapeDef.categoryBits = this.categoryBits;

            shapeDef.maskBits = this.maskBits;

            this.body.CreateShape(shapeDef);

            eventHorizon.radius = this.size.x * 4 * b2.SCALE;

            eventHorizon.isSensor = true;

            eventHorizon.userData = {
                name: "eventHorizon"
            };

            eventHorizon.categoryBits = this.categoryBits;

            eventHorizon.maskBits = this.maskBits;

            this.body.CreateShape(eventHorizon);

            this.body.SetMassFromShapes();

        },

        resize: function () {

            var shapeDef = new b2.CircleDef(),
                eventHorizon = new b2.CircleDef(),
                i,
                shapeCount = this.body.m_shapeCount,
                shapes = [];

            for (i = 0; i < shapeCount; i++) {

                if (i === 1) {

                    shapes.push(this.body.GetShapeList());

                } else {

                    shapes.push(this.body.GetShapeList().m_next);

                }

            }

            for (i = 0; i < shapeCount; i++) {

                this.body.DestroyShape(shapes[i]);

            }

            shapeDef.radius = this.size.x * b2.SCALE;

            shapeDef.isSensor = true;

            shapeDef.userData = {
                name: "blackhole"
            };

            shapeDef.categoryBits = this.categoryBits;

            shapeDef.maskBits = this.maskBits;

            this.body.CreateShape(shapeDef);

            eventHorizon.radius = this.size.x * 2 * b2.SCALE;

            eventHorizon.isSensor = true;

            eventHorizon.userData = {
                name: "eventHorizon"
            };

            eventHorizon.categoryBits = this.categoryBits;

            eventHorizon.maskBits = this.maskBits;

            this.body.CreateShape(eventHorizon);

        },

        update: function () {

            var thisPosition = this.body.GetPosition(),
                vector = new b2.Vec2(0, 0),
                contact,
                position;

            if (this.size.x < this.size.max) {

                this.size.x = this.size.y += this.size.increment;

                // ig.music.volume = (this.size.x / this.size.max) / 2;

                this.resize();

            }

            for (contact = this.body.m_contactList; contact !== null; contact = contact.next) {

                position = contact.other.GetPosition();

                vector.x = thisPosition.x - position.x;

                vector.y = thisPosition.y - position.y;

                ig.game.normaliseVector(vector, 5);

                contact.other.ApplyForce(vector, position);

            }

            this.parent();

        },

        draw: function () {

            var context = ig.system.context,
                bodyPosition = this.body.GetPosition(),
                position = {
                    x: (bodyPosition.x / b2.SCALE) - ig.game.screen.x,
                    y: (bodyPosition.y / b2.SCALE) - ig.game.screen.y
                },
                gradient;

            context.beginPath();

            context.arc(position.x, position.y, this.size.x * 4, 0, Math.PI * 2, false);

            gradient = context.createRadialGradient(position.x, position.y, this.size.x, position.x, position.y, this.size.x * 4);

            gradient.addColorStop(0, "rgba(255, 255, 255, 0.04)");

            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            context.fillStyle = gradient;

            context.fill();

            context.closePath();

            context.beginPath();

            context.arc(position.x, position.y, this.size.x, 0, Math.PI * 2, false);

            context.fillStyle = this.getColour();

            context.closePath();

            context.fill();

            context.closePath();

            this.parent();

        },

        collideWith: function (other, otherShape, shape) {

            if (shape.m_userData.name === "blackhole") {

                manager.stats.consumed++;

                if (other.particleType === "neutron") {

                    ig.game[other.particleType + "s"].kill(other.id);

                } else {

                    ig.game[other.particleType + "s"].remove(other.id);

                }

            }

            this.parent();

        },

        stopCollideWith: function (other, otherShape, shape) {

            // console.log("Stopped: ", otherShape);

        },

        getColour: function () {

            return 'rgba(' + this.color.join(',') + ', ' + this.alpha + ')';

        }

    });

});