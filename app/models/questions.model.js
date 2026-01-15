const db = require("../../database");

exports.listQuestionsForItem = (item_id, done) => {
    db.all(
        `SELECT * FROM questions WHERE item_id = ?`,
        [item_id],
        (err, rows) => {
            if(err) return done(err);
            done(null, rows)
        }
    );
};

exports.askQuestion = (item_id, user_id, question_text, done) => {
    db.run(
        `INSERT INTO questions (question, answer, asked_by, item_id)
        VALUES (?, NULL, ?, ?)`,
        [
            question_text,
            user_id,
            item_id
        ],
        function (err) {
            if(err) return done(err);
            done(null, this.lastID);
        }
    );
};

exports.answerQuestion = (question_id, answer_text, done) => {
    db.run(
        `UPDATE questions SET answer = ? WHERE question_id = ?`,
        [
            answer_text,
            question_id
        ],
        function(err) {
            if(err) return done(err);
            done(null);
        }
    );
};