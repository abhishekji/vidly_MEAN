const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

const {user} = require('../../../model/users');

describe('user test', () => {
    it('generate auth token', () => {
        const payload = { 
            _id: new mongoose.Types.ObjectId().toHexString(), 
            isAdmin: true
        };
        const userTest = new user(payload);
        const token = userTest.generateAuthToken();
        let decodedValue = null;
        jwt.verify(token, config.get('jwtPrivateKey'), function(err, decoded) {
            decodedValue = decoded;
        });
        expect(decodedValue).toMatchObject({_id: payload._id});
    });
});