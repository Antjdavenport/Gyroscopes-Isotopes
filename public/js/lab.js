requirejs.config({
    paths: {
        jquery: "components/jquery/jquery",
        sketch: "plugins/sketch",
        ga: "//google-analytics.com/ga",
        io: "plugins/socket.io",
        manager: "../lab/manager.min"
    },
    shim: {
        manager: {
            deps: ["jquery", "io"]
        },
        sketch: {
            exports: "Sketch",
            deps: ["jquery"]
        },
        "plugins/jquery.retinafy": {
            deps: ["jquery"]
        },
        ga: {
            exports: "_gaq"
        }
    }
});

requirejs(["jquery", "modules/dust", "modules/retinafy", "modules/analytics", "modules/retinafy", "manager", "utilities/log"], function ($, dust, analytics, retinafy) {

    var app = {
        Modules: {
            dust: dust,
            analytics: analytics,
            retinafy: retinafy
        },
        Events: $({}),
        init: function () {
            var i;
            for (i in this.Modules) {
                this.Modules[i].init(this.Events);
            }
        }
    };

    $(document).ready(function () {
        app.init();
    });

});