const mongoose = require('mongoose');
const Joi = require('joi');

// Setting up the mongoose schema
const genreSchema = new mongoose.Schema({
    movie: {
        type: String,
        required: true,
        minlength : 5,
        maxlength: 50
    },
    genre: String
})

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre() {
    const schema = {
        movie: Joi.string().min(5).max(50).required(),
        genre: Joi.required()
    }
    return schema;
}

module.exports = {
    validate: validateGenre,
    genre: Genre,
    genreSchema: genreSchema
}
