ig.module(
    'plugins.jquery-countdown'
).defines(function () {

    (function ($) {

        $.fn.countdown = function (callback) {

            var countdown = {

                radix: 10,

                interval: 100,

                stopTimeout: false,

                init: function ($element, callback) {

                    this.$deciseconds = $element.find(".deciseconds");

                    this.deciseconds = parseInt(this.$deciseconds.text(), this.radix);

                    this.$seconds = $element.find(".seconds")

                    this.seconds = parseInt(this.$seconds.text(), this.radix);

                    this.$minutes = $element.find(".minutes")

                    this.minutes = parseInt(this.$minutes.text(), this.radix);

                    this.callback = callback;

                    this.original = [this.minutes, this.seconds, this.deciseconds];

                    $element.data("countdown", this);

                    this.run();

                },

                run: function () {

                    var self = this;

                    this.timeout = setTimeout(function () {

                        if (self.stopTimeout === true) {

                            self.stopTimeout = false;

                            return false;

                        }

                        if (self.deciseconds === 0 && self.seconds === 0 && self.minutes === 0) {

                            // stop

                            self.callback();

                        } else {

                            if (self.deciseconds > 0) {

                                self.deciseconds--;

                                self.$deciseconds.text("0" + self.deciseconds);

                            } else if (self.seconds > 0) {

                                self.seconds--;

                                if (self.seconds < 10) {

                                    self.$seconds.text("0" + self.seconds);

                                } else {

                                    self.$seconds.text(self.seconds);

                                }

                                self.deciseconds = 9;

                                self.$deciseconds.text("0" + self.deciseconds);

                            } else if (self.minutes > 0) {

                                self.minutes--;

                                if (self.minutes < 10) {

                                    self.$minutes.text("0" + self.minutes);

                                } else {

                                    self.$minutes.text(self.minutes);

                                }

                                self.seconds = 59;

                                self.$seconds.text(self.seconds);

                                self.deciseconds = 9;

                                self.$deciseconds.text("0" + self.deciseconds);

                            }

                            self.run();

                        }

                    }, this.interval);

                },

                stop: function () {

                    this.stopTimeout = true;

                },

                restart: function () {

                    this.run();

                },

                reset: function () {

                    this.stop();

                    this.minutes = this.original[0];

                    this.seconds = this.original[1];

                    this.deciseconds = this.original[2];

                    this.$minutes.text("0" + this.minutes);

                    this.$seconds.text("0" + this.seconds);

                    this.$deciseconds.text("0" + this.deciseconds);

                }

            };

            return this.each(function () {

                countdown.init($(this), callback);

            });

        };

    })(jQuery);

});