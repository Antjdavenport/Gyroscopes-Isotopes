ig.module(
    'plugins.jquery-countdown'
).defines(function () {

    (function ($) {

        $.fn.countdown = function (callback) {

            var countdown = {

                radix: 10,

                interval: 1000,

                stopTimeout: false,

                init: function ($element, callback) {

                    console.log("INITIATED");

                    this.$seconds = $element.find(".seconds");

                    this.seconds = parseInt(this.$seconds.text(), this.radix);

                    this.callback = callback;

                    this.original = this.seconds;

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

                        if (self.seconds === 0) {

                            // stop

                            self.callback();

                        } else {

                            if (self.seconds > 0) {

                                self.seconds--;

                                self.$seconds.text(self.seconds);

                            }

                            self.run();

                        }

                    }, this.interval);

                },

                stop: function () {

                    console.log("countdown stop");

                    this.stopTimeout = true;

                },

                restart: function () {

                    console.log("countdown restart");

                    this.run();

                },

                reset: function () {

                    console.log("countdown reset");

                    this.stop();

                    this.seconds = this.original;

                    this.$seconds.text(this.seconds);

                }

            };

            return this.each(function () {

                countdown.init($(this), callback);

            });

        };

    })(jQuery);

});