define(["jquery", "sketch", "modules/particle"], function ($, Sketch, particle) {
    var dust = {
        $el: $("#particles"),
        count: 500,
        particles: [],
        method: "wobble",
        init: function (Events) {
            var i;
            this.Events = Events;
            this.ctx = Sketch.create({
                container: this.$el[0],
                retina: true,
                draw: this.draw,
                resize: this.resize
            });
            for (i = 0; i < this.count; i++) {
                this.particles.push($.extend({ method: this.method }, particle));
                this.particles[i].init(this.ctx);
            }
            this.initialised = true;
        },
        draw: function () {
            var i;
            this.beginPath();
            this.rect(0, 0, this.width, this.height);
            this.fillStyle = "#222";
            this.fill();
            this.closePath();
            for (i = 0; i < dust.count; i++) {
                dust.particles[i].draw();
            }
        },
        resize: function () {
            if (dust.initialised === true) {
                for (i = 0; i < dust.count; i++) {
                    dust.particles[i].move();
                }
            }
        }
    };
    return dust;
});