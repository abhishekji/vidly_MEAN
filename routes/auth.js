const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const {user} = require('../model/users');

// Post call
router.post('/', async (req,res) => {
    const { error } = validate(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    let users = await user.findOne({ email: req.body.email });

    if(!users) { return res.status(400).send('Invalid email or password')};
    const validatePassword = await bcrypt.compare(req.body.password, users.password);
    if(!validatePassword) {
        return res.send(400).status('Invalide password');
    }
    // const token = jwt.sign({_id: users._id}, config.get('jwtPrivateKey'));
    const token = users.generateAuthToken();
    
    res.send(token);
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;

