/**
 * Dependencies
 */

var mainController = require("./controllers/mainController"),
    labController = require("./controllers/labController");

/**
 * Routes
 */

module.exports = function (app) {
    app.get("/", mainController.index);
    app.get("/gyroscopes-and-isotopes", labController.index);
    app.get("/gyroscopes-and-isotopes/induction", labController.induction);
    app.get("/gyroscopes-and-isotopes/lab/create?", labController.create);
    app.get("/gyroscopes-and-isotopes/lab/:id?", labController.single);
    app.get("/gyroscopes-and-isotopes/lab/:id/controller?", labController.controller);
};