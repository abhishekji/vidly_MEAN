const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');

const { Rental } = require('../../model/rental');
const { user } = require('../../model/users');
const { Movie } = require('../../model/movies');


describe('/api/returns', () => {
    let server;
    let customerId, movieId, rental, token, movie;

    const exec = () => {
        return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId, movieId});
    };

    beforeEach(async () => {
        server = require('../../index');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new user().generateAuthToken();
        movie = new Movie({
            _id: movieId,
            title: '1234324',
            dailyRentalRate: 2,
            genre: { movie: '12345'},
            numberinStock: 13
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'Aman',
                phone: '234234234'
            },
            movie: {
                _id: movieId,
                title: '1234324',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });

    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    it('should return 401 if client is not logged in', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    
    it('should return 400 if customerId is not provided', async () => {
        customerId = null;
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
        movieId = null;
        const res = await exec();
        console.log(res);
        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found with customer movie combination', async () => {
        await Rental.remove({});
        const res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 400 if this rental is already processed', async () => { // if the return date is set
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if it is a valid request', async () => { // if the return date is set
        const res = await exec();
        expect(res.status).toBe(200);
    });

    it('should return 200 if it is a valid request and set the date returned', async () => { // if the return date is set
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = Date.now() - Date.parse(rentalInDb.dateReturned);
        expect(diff).toBeLessThan(10*1000);
    });

    it('should set rental fee if input is valid', async () => { // if the return date is set
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBeDefined();
    });

    it('should increase the movie stock if input is valid', async () => { // if the return date is set
        const res = await exec();
        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberinStock).toBe(movie.numberinStock + 1);
    });

    it('should return the rental if input is valid', async () => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);

        // expect(res.body).toMatchObject(rentalInDb); // it will not work because date object is returned 
        //by database fetch and string is returned on response received by client

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'])
        );
    });

});