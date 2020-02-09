const mongoose = require('mongoose');

const {user} = require('../../../model/users');
const auth = require('../../../middleware/auth');

describe('auth middleware', () => {
    it('should populate req.user with a payload of a valid JWT', () => {
        const userDetails = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true};
        const token = new user(userDetails).generateAuthToken();
        const req = {
            header : jest.fn().mockReturnValue(token)
        }
        const res = {};
        const next = jest.fn();

        auth(req, res, next);
        expect(req.user).toBeDefined();
        expect(req.user).toHaveProperty('_id', userDetails._id);
    })
})