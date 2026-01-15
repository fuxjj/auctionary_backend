const db = require("../../database");
const crypto = require("crypto");

const getHash = (password, salt) => {
    return crypto.pbkdf2Sync (password, salt, 100000, 64, "sha512").toString("hex");
};

exports.getIDFromToken = (token, done) => {
    db.get(
        `SELECT user_id FROM users WHERE session_token = ?`,
        [token],
        (err, row) => {
            if (err) return done(err);
            done(null, row?.user_id);
        }
    )
}

exports.addNewUser = (user, done) => {
    const salt = crypto.randomBytes(64).toString("hex");
    const hash = getHash(user.password, salt);

    db.run(
        `INSERT INTO users (first_name, last_name, email, password, salt)
        VALUES (?, ?, ?, ?, ?)`,
        [user.first_name, user.last_name, user.email, hash, salt],
        function (err) {
            if(err) {
                if(err.code === "SQLITE_CONSTRAINT") { //dont allow duplicate emails
                    return done({ type: "DUPLICATE_EMAIL" });
                }
                return done(err);
            }
            done(null, this.lastID)
        }
    );
};

exports.authenticateUser = (email, password, done) => {
    db.get(
        `SELECT user_id, password, salt FROM users WHERE email = ?`,
        [email],
        (err, user) => {
            if (err) return done(err);
            if (!user) return done("user not found");

            const hash = getHash(password, user.salt);

            if (hash !== user.password) {
                return done("Invalid credentials")
            }

            done(null, user.user_id);
        }
    );
};

exports.setToken = (user_id, done) => {
    const token = crypto.randomBytes(32).toString("hex");

    db.run(
        `UPDATE users SET session_token = ? WHERE user_id = ?`,
        [token, user_id],
        (err) => {
            if(err) return done(err);
            done(null, token)
        }
    );
};

exports.getToken = (user_id, done) => {
    db.get(
        `SELECT session_token FROM users WHERE user_id = ?`,
        [user_id],
        (err, row) => {
            if(err) return done(err);
            done(null, row?.session_token);
        }
    );
};

exports.removeToken = (token, done) => {
    db.run(
        `UPDATE users SET session_token = NULL WHERE session_token = ?`,
        [token],
        function (err) {
            if(err) return done(err);
            done(null, this.changes); //return anything that wasupdated
        }
    )
}