ig.module(
    'game.entities.positron'
)
.requires(
    'game.entities.particle'
)
.defines(function () {

    EntityPositron = EntityParticle.extend({

        particleType: 'positron',

        colour: [0, 220, 180],

        processCollision: function (other, otherShape) {

            if (other.particleType === "neutron" && otherShape.m_userData.name === "neutron") {

                other.absorb();

                manager.stats.positrons++;

            }

            this.parent();

        }

    });

});