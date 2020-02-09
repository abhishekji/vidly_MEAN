const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Joi = require('joi');
const { movieSchema, Movie, validateMovie } = require('../model/movies');

// Routes related calls

// Get call

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
})

// POST call

router.post('/', async (req, res) => {
    const validatingSchema = validateMovie();
    const result = Joi.validate(req.body, validatingSchema);
    console.log(result);
    if(result.error || !req.body) return res.send('Error in request').status(400);

    const movie = new Movie({
        title: req.body.title,
        genre: req.body.genre,
        numberinStock: req.body.numberinStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    const savedResult = await movie.save();
    console.log(savedResult);
    res.send(savedResult);
});

// PUT call

router.put('/:title', async (req, res) => {
    const receivedMovie = req.params.title.trim();

    const movieTobeUpdate = await Movie.update({title: receivedMovie }, {
        $set: {
            title: req.body.title
        }
    });
    res.send(movieTobeUpdate);

});

// Delete call

router.delete('/:title', async (req, res) => {
   const deletedList = await Movie.deleteOne({ title: req.params.title.trim()});
   res.send(deletedList);

});

module.exports = router;