const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    isGold: Boolean,
    name: {
       type: String,
       required: true,
       maxlength: 20,
       minlength:3,
       validate: {
           validator: function(elem, callback){
                return elem.length > 3;
           },
            message: "String should be atleast 3 characters long"
       }
    },
    phone: String
});

const CustomerModel = mongoose.model('Customer', customerSchema);

module.exports.customer = CustomerModel;