const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const {user, validate} = require('../model/users');
const auth = require('../middleware/auth');

// Get call
router.get('/me', auth, async (req, res) => {
    const userSent = await user.findById(req.user._id).select('-password');
    res.send(userSent);
});

// Post call
router.post('/', async (req,res) => {
    const { error } = validate(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    let users = await user.findOne({ email: req.body.email });

    if(users) { return res.status(400).send('User already registered..')};

    // users = new user({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });

    users = new user(_.pick(req.body, ['name','email','password']));
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    console.log(users.password);
    users.password = await bcrypt.hash(users.password, salt);
    await users.save();

    const token = users.generateAuthToken();
    // const token = jwt.sign({_id: users._id}, config.get('jwtPrivateKey'));
    res.header('x-auth-token', token).send(_.pick(users, ['_id','name','password']));
    // const users = await user.find().sort('name');
    // res.send(users);
});

module.exports = router;
