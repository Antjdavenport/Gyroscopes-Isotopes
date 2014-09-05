define(["jquery"], function ($) {
    var particle = {
        radius: 1,
        init: function (ctx) {
            this.ctx = ctx;
            this.alpha = random();
            this.pos = {
                x: random(this.ctx.width),
                y: random(this.ctx.height)
            };
        },
        draw: function () {
            this.ctx.beginPath();
            this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, TWO_PI);
            this.ctx.fillStyle = "rgba(255, 255, 255, " + this.alpha + ")";
            this.ctx.fill();
            this.ctx.closePath();
            this[this.method]();
            // stop all the particles running off the canvas
        },
        move: function () {
            this.pos = {
                x: random(this.ctx.width),
                y: random(this.ctx.height)
            };
        },
        wobble: function () {
            this.pos.x += Math.round(random(-1, 1));
            this.pos.y += Math.round(random(-1, 1));
        }
    };
    return particle;
});