ig.module(
    'game.entities.negatron'
)
.requires(
    'game.entities.particle'
)
.defines(function () {

    EntityNegatron = EntityParticle.extend({

        particleType: 'negatron',

        colour: [240, 80, 60],

        size: {

            x: 4,

            y: 4

        },

        processCollision: function (other, otherShape) {

            if (other.particleType === "neutron" && otherShape.m_userData.name === "neutron") {

                other.decay();

                manager.stats.negatrons++;

            }

            this.parent();

        }

    });

});