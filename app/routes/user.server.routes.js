const users = require('../controllers/user.server.controllers');

module.exports = function(app) {
    // User routes
    app.route("/users")
        .post(users.create_account);

    app.route("/login")
        .post(users.login);

    app.route("/logout")
        .post(users.logout);
}