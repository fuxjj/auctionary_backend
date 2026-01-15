const users = require("../models/user.models")
const Joi = require("joi");


const create_account = (req, res) => {

    //VALIDATE INFORMATION
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    users.addNewUser(req.body, (err, id) => {
        if(err) return res.status(500).send(err);
        res.status(201).send({ id });
    });
}

const login = (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    users.authenticateUser(req.body.email, req.body.password, (err, id) => {
        if(err) return res.status(401).send(err);

        users.getToken(id, (err, token) => {
            if(token) return res.send({ token });

            users.setToken(id, (err, newToken) => {
                res.send({ token: newToken})
            })
        })
    })
}

const logout = (req, res) => {
    const token = req.get("X-Authorization");

    users.removeToken(token, (err) => {
        if(err) return res.sendStatus(500);
        return res.sendStatus(200)
    })
}


module.exports = {
    create_account: create_account,
    login: login,
    logout: logout
}
