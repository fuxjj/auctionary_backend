const Joi = require("joi");
const questions = require("../models/questions.model")

const listQuestion = (req, res) => {
    const item_id = req.params.id;

    questions.listQuestionsForItem(item_id, (err, rows) => {
        if(err) return res.sendStatus(500);
        return res.status(200).send(rows);
    });
};


const askQuestion = (req, res) => {
    const schema = Joi.object({
        question_text: Joi.string().min(1).required()
    })

    const { error } = schema.validate(req.body);
    if(error) {
        return res.status(400).json({ error_message: error.details[0].message});
    };

    const item_id = req.params.id;
    const user_id = req.user_id;

    questions.askQuestion(item_id, user_id, req.body.question_text, (err, question_id) => {
        if(err) return res.sendStatus(500);
        return res.status(201).send({ question_id });
    })

}

const answerQuestion = (req, res) => {
    const schema = Joi.object({
        answer_text: Joi.string().min(1).required()
    })

    const { error } = schema.validate(req.body);
    if(error) {
        return res.status(400).json({ error_message: error.details[0].message});
    };

    const question_id = req.params.question_id;

    questions.answerQuestion(question_id, req.body.answer_text, (err) => {
        if(err) return res.sendStatus(500);
        return res.sendStatus(200);
    });
};

module.exports = {
    listQuestion,
    askQuestion,
    answerQuestion
}