const events = require('../controllers/core.server.controllers');
const auth = require("../lib/authentication");

module.exports = function(app) {
        //Core auction functionality 
    app.route("/items")
        .get(events.search)
        .post(auth, events.createItem)

    app.route("/items/:id")
        .get(events.getSingleItem);
    
    app.route("/items/:id/bids")
        .get(events.getHistory)
        .post(auth, events.bidItem);

}