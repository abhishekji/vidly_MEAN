const winston = require('winston');

module.exports = function(err, req, res, next) {
    winston.error(err.message, err);

    // error
    // warn
    // info ( Logged into mongodb - error, warn, info but nothing afte that in the line)
    // verbose
    // debug
    // sally

    // Log the exception
    res.status(500).send('Something failed..');
}
