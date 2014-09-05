ig.module(
    'game.entities.dust'
)
.requires(
    'game.entities.particle'
)
.defines(function () {

    EntityDust = EntityParticle.extend({

        particleType: 'dust',

        colour: [255, 255, 255],

        maxAlpha: undefined,

        size: {

            x: 1,

            y: 1

        },

        force: {

            min: 15,

            max: 30

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

            shapeDef.filter.categoryBits = 3;

            shapeDef.filter.maskBits = 1;

            this.body.CreateShape(shapeDef);

            this.body.SetMass(massData);

        }

    });

});
