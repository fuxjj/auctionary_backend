const questions = require('../controllers/questions.server.controllers');
const auth = require('../lib/authentication');

module.exports = function(app) {
    app.route("/items/:id/questions")
        .get(questions.listQuestion)
        .post(auth, questions.askQuestion)

    app.route("/items/:id/questions/:question_id")
        .post(auth, questions.answerQuestion)
}