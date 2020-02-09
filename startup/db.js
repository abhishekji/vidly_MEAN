const winston = require('winston');
const config = require('config');

module.exports = function(mongoose) {
    const db = config.get('db');
    mongoose.connect(db)
    .then(()=> {
       console.log('MongoDB connected');
       winston.info(`MongoDB connected to ${db}`);
    })
    // Not needed as now unhandled rejections are being handled by logging as well as exiting the process
    // .catch((err)=> {
    //     console.error('Connection failed'+ err);
    // });
}