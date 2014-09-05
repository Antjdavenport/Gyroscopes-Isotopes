ig.module(
    'plugins.box2d.collisions'
)
.requires(
    'plugins.box2d.entity',
    'plugins.box2d.game'
)
.defines(function(){

    ig.Box2DEntity.inject({

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            if (!ig.global.wm) {
                this.body.entity = this;
            }
        }

    });

    ig.Box2DGame.inject({

        // remove impact's collision detection
        // for performance
        checkEntities: function () {}

    });

});