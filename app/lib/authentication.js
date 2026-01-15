const users = require("../models/user.models");

module.exports = (req, res, next) => {
    const token = req.get("X-Authorization");

    if(!token) return res.sendStatus(401);

    users.getIDFromToken(token, (err, id) => {
        if(err || !id ) return res.sendStatus(401);
        req.user_id = id;
        next();
    });
};
