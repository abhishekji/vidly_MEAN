const express = require('express');
const app = express();
const mongoose = require('mongoose');
const winston = require('winston');

require('./startup/logging')();
require('./startup/db')(mongoose);
require('./startup/routes')(app);
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 3000;

const server = app.listen(port , () => {
    console.log(`Listening on port ${port}`);
    winston.info(`Listening on port ${port}`);
});

module.exports = server;