const db = require("../../database");

exports.createItem = (item, done) => {
    const startDate = Date.now()

    db.run(
        `INSERT INTO items (name, description, starting_bid, start_date, end_date, creator_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            item.name,
            item.description,
            item.starting_bid,
            startDate,
            item.end_date,
            item.creator_id
        ],
        function (err) {
            if(err) return done(err);
            done(null, this.lastID);
        }
    );
};

exports.getItemById = (item_id, done) => {
    db.get(
        `SELECT * FROM items WHERE item_id = ?`,
        [item_id],
        (err, row) => {
            if(err) return done(err);
            done(null, row);
        }
    );
};

exports.searchItem = (done) => {
    db.all(
        `SELECT * FROM items`,
        [],
        (err, rows) => {
            if(err) return done(err);
            done(null, rows);
        }
    );
};

exports.placeBid = (item_id, user_id, amount, done) => {
    const ts = Date.now()

    db.run(
        `INSERT INTO bids (item_id, user_id, amount, timestamp)
        VALUES (?, ?, ?, ?)` ,
        [item_id,
         user_id,
         amount, 
         ts
        ],
        function (err) {
            if(err) return done(err);
            done(null);
        }
    );
};

exports.getBidHistory = (item_id, done) => {
    db.all(
        `SELECT * FROM bids WHERE item_id = ? ORDER BY timestamp DESC`,
        [item_id],
        (err, rows) => {
            if(err) return done(err);
            done(null, rows)
        }
    );
};