const Joi = require("joi");
const items = require("../models/item.model");

const search = (req, res) => {
    items.searchItem((err, rows) => {
        if(err) return res.sendStatus(500);
        return res.status(200).send(rows)
    })
}

const createItem = (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        starting_bid: Joi.number().positive.required(),
        end_date: Joi.number().min(2025).required()
    });

    const { error } = schema.validate(req.body);
    if(error) {
        return res.status(400).json({ error_message: error.details[0].message});
    };

    const creator_id = req.user_id; //middleware

    items.createItem( 
        {...req.body, creator_id},
        (err, id) => {
            if(err) return res.sendStatus(500);
            return res.status(201).send({ item_id: id })
        }
    )
}

const getSingleItem = (req, res) => {
    const item_id = req.params.id;

    items.getItemById(item_id, (err, item) => {
        if(err) return res.sendStatus(500);
        if(!item) return res.sendStatus(404);
        return res.status(200).send(item)
    })
}

const bidItem = (req, res) => {
    const schema = Joi.object({
        amount: Joi.number().required()
    })

    const { error } = schema.validate(req.body);
    if(error) {
        return res.status(400).json({ error_message: error.details[0].message});
    };

    const item_id = req.params.id;
    const user_id = req.params.id;

    items.placeBid(item_id, user_id, req.body.amount, (err) => {
        if(err) return res.sendStatus(500);
        return res.sendStatus(201);
    })
}

const getHistory = (req, res) => {
    const item_id = req.params.id;
    items.getBidHistory(item_id, (err, rows) => {
        if(err) return res.sendStatus(500);
        return res.status("200").send(rows)
    })
}

module.exports = {
    search,
    createItem,
    getSingleItem,
    bidItem,
    getHistory
}