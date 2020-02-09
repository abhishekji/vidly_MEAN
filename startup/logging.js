const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
    winston.handleExceptions(
        new winston.transports.Console({colorize: true, prettyPrint: true}),
        new winston.transports.File({ filename: 'logfile.log'})
    );
    
    process.on('unhandledRejection', (ex) => {
        console.log('We got an handled rejection');
        winston.error(ex.message, ex);
        process.exit(1);
    });

    process.on('uncaughtException', (ex) => {
        console.log('We got an uncaught exception');
        winston.error(ex.message, ex);
        process.exit(1);
    });



    // var p = new Promise((reject) => {
    //     throw new Error('Some error has occured in the project');
    // });

    // throw new Error('Some error has occured in the project');

    // winston.add(winston.transports.File, { filename: 'logfile.log'}); // Old winston version 2 usage
    // winston.add(winston.transports.MongoDB, { db : 'mongodb://localhost:vidly' });
    // winston.configure({transports: [new winston.transports.MongoDB({ db : 'mongodb://localhost/genres' }) ]});
    winston.configure({transports: [new winston.transports.File({ filename: 'logfile.log' }) ]});

}