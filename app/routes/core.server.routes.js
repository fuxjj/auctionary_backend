const events = require('../controllers/core.server.controllers');
const auth = require("../lib/authentication");

module.exports = function(app) {
        //Core auction functionality 
    app.route("/item")
        .get(events.search)
        .post(auth, events.createItem)

    app.route("/item/:id")
        .get(events.getSingleItem);
    
    app.route("/item/:id/bid")
        .get(events.getHistory)
        .post(auth, events.bidItem);

}