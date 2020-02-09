const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {customer} = require('../model/customer');
// APIs for customers

// Get call

router.get('/', async (req, res) => {
    const getAllData = await customer.find();
    console.log(getAllData);
    res.send(getAllData);
});

// POST call

router.post('/', async (req, res) => {
    const requestCheck = {
        isGold: Joi.required(),
        name: Joi.required(),
        phone: Joi.required()
    };
    const result = Joi.validate(req.body, requestCheck);
    if(result.error || !req.body) res.status(400).send('Error occurred in request body');
    const customerObject = new customer ({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });
    const savedResult = await customerObject.save();
    console.log(savedResult);
    res.send(savedResult);
});

// PUT call

router.put('/:name', async (req, res) => {
    const schema = {
        name: Joi.required()
    }
    const result = Joi.validate(req.body, schema);
    if(result.error || !req.body) res.status(400).send('Error occured while sending request');
    const customerUpdated = req.body;
//    await customer.find({name: req.params.name.trim()})
    const updatedCustomer = await customer.update({name: req.params.name.trim()}, {
        $set : {
            name: customerUpdated.name
        }
    });
    res.send(updatedCustomer);
});

// Delete call

router.delete('/:name', async (req, res) => {
    console.log('Deleted');
    const deletedElement = await customer.deleteOne({name: req.params.name.trim()});
    res.send(deletedElement);
})

module.exports = router;