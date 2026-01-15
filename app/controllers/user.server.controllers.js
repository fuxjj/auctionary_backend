const users = require("../models/user.models")
const Joi = require("joi");


const create_account = (req, res) => {

    //VALIDATE INFORMATION
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string()
        .min(6)
        .max(20)
        .pattern(/[0-9]/, 'number') //password needs a number
        .pattern(/[A-Z]/, 'uppercase') //password needs an uppercase
        .pattern(/[a-z]/, 'lowercase') //password needs a lowercase
        .pattern(/[!@#$%^&*(),.?":{}|<>_\-\[\]\\\/]/, 'special') //password needs a special character
        .required()
    }).unknown(false); //reject anything extra

    const { error } = schema.validate(req.body);
    if(error) {
        return res.status(400).json({ error_message: error.details[0].message });
    };
    
    users.addNewUser(req.body, (err, id) => {
        if(err) {
            if(err.type === "DUPLICATE_EMAIL") {
                return res.status(400).json({ error_message: "Email already exists" });
            }
            return res.sendStatus(500);
        }
        res.status(201).json({ user_id: id });
    });
}

const login = (req, res) => {
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required()
    }).unknown(false);

    const { error } = loginSchema.validate(req.body);
    if(error) {
        return res.status(400).json({ error_message: error.details[0].message });
    }; 

    users.authenticateUser(req.body.email, req.body.password, (err, id) => {
        if(err) {
            if(err === "user not found" || err === "Invalid credentials") {
                return res.status(400).json({ error_message: err });
            }
            return res.sendStatus(500);
        };

        users.getToken(id, (err, token) => {
            if (err) return res.sendStatus(500);

            if(token) {
                return res.status(200).json({user_id: id, session_token: token})
            };

            users.setToken(id, (err, newToken) => {
                if(err) return res.sendStatus(500);
                res.status(200).json({
                    user_id: id,
                    session_token: newToken
                })
            })
        })
    })
}

const logout = (req, res) => {
    const token = req.get("X-Authorization");
    if(!token) return res.status(401);

    users.removeToken(token, (err, changes) => {
        if(err) return res.sendStatus(500);
        if(!changes) return  res.sendStatus(401); //no user had that specific token
        return res.sendStatus(200)
    })
}


module.exports = {
    create_account: create_account,
    login: login,
    logout: logout
}
