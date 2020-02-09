const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const validateObjectId = require('../middleware/validataObjectId');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
require('express-async-errors');
const {genre, validate} = require('../model/genre');

// Create the genre database and store the collection in it

// async function createGenre() {
//     const genre = new genre(

//     )
// }

// const genres = [
//     {
//         movie: 'Mission Impossible',
//         genre: 'Action'
//     },
//     {
//         movie: 'Mohabattein',
//         genre: 'Romance'
//     },
//     {
//         movie: 'DDLJ',
//         genre: 'Romance'
//     }

// ]

// Get call
router.get('/', async (req, res) => {
 //   throw new Error('Some error occured....');
    const genres = await genre.find().sort('movie');
    res.send(genres);
});

// POST call

router.post('/', auth, async (req, res) => {
    const schema = validate();
    const result = Joi.validate(req.body, schema);
    if(!req.body) return res.status(400).send('Request body not sent');

    if(result.error) return res.status(400).send('Request body not sent');
    const genreObject = new genre({
        movie: req.body.movie,
        genre: req.body.genre
    });
    const savedResult = await genreObject.save();
    console.log(savedResult);
    // const movieProvided = req.body;
    // genres.push(movieProvided);
//    res.send(genres);
    res.send(savedResult);
});

// PUT call

router.put('/:movie', async (req, res) => {
    const schema = validate();
    const result = Joi.validate(req.body, schema);

    if(!req.body || result.error) return res.status(400).send('Request body not sent');

    const movieTobeUpdated = req.params.movie.trim();

    let selectedElement = await genre.update({movie: movieTobeUpdated},{
        $set : {
            movie: req.body.movie
        }
    });
    
    // let selectedElement = genres.find((elem) => {
    //     return elem.movie === movieTobeUpdated
    // });
    // selectedElement.movie = req.body.movie;
    res.send(selectedElement);
});

// Delete call
router.delete('/:movie', [auth, admin, validateObjectId], async (req, res) => {
    const deletedElement = await genre.deleteOne({movie: req.params.movie.trim()});
    const remainingMovies = await genre.find();
    // const movieTobeDeleted = req.params.movie;
    // const remainingMovies = genres.filter((elem) => {
    //     return elem.movie !== movieTobeDeleted
    // })
    
    res.send(remainingMovies);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const genres = await genre.findById(req.params.id); // will not return id if it is not a valid object id
                                                        // that is why needed above steps
    if (!genres) return res.status(404).send('The genre with the given Id is not available');
    res.send(genres);
});

module.exports = router;
