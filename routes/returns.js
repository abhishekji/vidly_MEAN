const express = require('express');
const router = express.Router();
const Joi = require('joi');

const { Rental } = require('../model/rental');
const { Movie } = require('../model/movies');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/', [auth, validate(validateReturn)] , async (req, res) => {
    // Static method: Rental.lookup
    // Instance method: new User().generateAuthToken()



    // if(! req.body.customerId) return res.status(400).send('Customer Id is not provided');
    // if(! req.body.movieId) return res.status(400).send('Movie Id is not provided');

    // const rentalFound = await Rental.findOne({
    //     'customer._id': req.body.customerId,
    //     'movie._id': req.body.movieId
    // })

    const rentalFound = await Rental.lookUp(req.body.customerId, req.body.movieId);

    if(!rentalFound) return res.status(404).send('Rental not found');
    if(rentalFound.dateReturned) return res.status(400).send('Rental already processed');

    // Information expert principle
    rentalFound.return(); // It will return the required executed value and it is an instance method


    await rentalFound.save();

    await Movie.update({
        _id: rentalFound.movie._id},{
        $inc: {
           numberinStock: 1
        }
    });
    return res.send(rentalFound);
});

function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;
