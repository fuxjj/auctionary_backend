const questions = require('../controllers/questions.server.controllers');
const auth = require('../lib/authentication');

module.exports = function(app) {
    app.route("/item/:id/question")
        .get(questions.listQuestion)
        .post(auth, questions.askQuestion)

    app.route("/item/:id/question/:question_id")
        .post(auth, questions.answerQuestion)
}