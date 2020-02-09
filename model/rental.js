const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String, 
                required: true, 
                minlength: 3,
                maxlength: 30
            },
            isGold: {
                type: Boolean,
                default: false
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 30
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 2,
                max: 40
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

rentalSchema.statics.lookUp = function(customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    })
};

rentalSchema.methods.return = function() {
    this.dateReturned = Date.now();
    
    const rentalDays = 4; // just putting it as a quite different behavior of moment js
    // moment().diff(new Date(Date.parse(rentalFound.dateOut)), 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
    return Joi.validate(rental, schema);
}

module.exports = { rentalSchema, Rental, validateRental }
