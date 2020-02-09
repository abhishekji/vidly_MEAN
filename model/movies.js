const mongoose = require('mongoose');
const { genreSchema } = require('./genre');
const Joi = require('joi');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 4,
        maxlength: 30
    },
    genre: genreSchema,
    numberinStock: {
        type: Number,
    },
    dailyRentalRate: {
        type: Number,
    }
});

function validateMovie() {
    const schema = {
        title: Joi.required(),
        genre: Joi.required(),
        numberinStock: Joi.optional(),
        dailyRentalRate: Joi.optional()
    }
    return schema;
}

const Movie = mongoose.model('Movie', movieSchema);

module.exports = {
    movieSchema: movieSchema,
    Movie: Movie,
    validateMovie: validateMovie
}
