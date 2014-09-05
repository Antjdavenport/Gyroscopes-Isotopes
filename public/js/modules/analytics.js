define(["ga"], function (ga) {
    var analytics = {
        init: function () {
            if (config.debug === false) {
                ga.push(["_setAccount", "UA-39184165-1"]);
                ga.push(["_trackPageview"]);
                ga.push(["_trackPageLoadTime"]);
                return ga;
            } else {
                console.log("Debug mode: %s.", "no analytics");
                return this;
            }
        }
    };
    return analytics;
});