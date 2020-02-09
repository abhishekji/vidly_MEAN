const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const router = express.Router();
const Fawn = require('fawn');

const { customer } = require('../model/customer');
const { Movie } = require('../model/movies');

const { rentalSchema, Rental, validateRental } = require('../model/rental');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
})

router.post('/', async (req, res) => {
    const customerElement = await customer.findById(req.body.customerId);
    if(!customerElement) return res.send(400).status('Customer is not present');

    const movies = await Movie.findById(req.body.movieId);
    if(!movies) return res.send(400).status('Movie is not present');

    const result = validateRental(req.body);
    if(result.error || !req.body)  return res.status(400).send('Error occurred');

    const rentalElement = new Rental({
        customer: {
            id: customerElement._id,
            name: customerElement.name
        },
        movie: {
            id: movies.id,
            title: movies.title,
            dailyRentalRate: movies.dailyRentalRate
        }
    });
    try {
        new Fawn.Task()
        .save('rentals', rentalElement) // case sensitive
        .update('movies', { _id: movies._id}, {
            $inc: { numberinStock: -1 }
        })
        .run();
        // const rentalResult = await rentalElement.save();
        res.send(rentalElement );
    } catch(err) {
        res.status(500).send('Something failed.. ')
    }

});

module.exports = router;
