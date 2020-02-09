const express = require('express');
const genres = require('../routes/generes');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rental');
const users = require('../routes/users');
const auth = require('../routes/auth');
const err = require('../middleware/error');
const returns = require('../routes/returns');

module.exports = function(app) {
    app.use(express.json()); // Creates a middleware
    
    app.use('/api/genres', genres);
    
    app.use('/api/customers', customers);
    
    app.use('/api/movies', movies);
    
    app.use('/api/rentals', rentals);
    
    app.use('/api/users', users);
    
    app.use('/api/auth', auth);
    
    app.use('/api/returns', returns);
    
    app.use('/', (req, res) => {
        res.status(404).send('Welcome, please enter the required genres URL');
    })
    
    app.use(err);
}