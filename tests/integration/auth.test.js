const request = require('supertest');
const {user} = require('../../model/users');
const {genre} = require('../../model/genre');

let server;
let token;

xdescribe('auth middleware', () => {
    beforeEach(() => {
        server = require('../../index');
    }, 20000);

    afterEach( async () => {
        await server.close();
        await genre.remove({});
    })
    describe('Post authorization', () => {
        const exec = () => {
            return request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({
                    movie: 'Deewana1',
                    genre: 'Romance'
                });
            // extra work

        };

        beforeEach(() => {
            token = new user().generateAuthToken();
        })

        it('should return 401 if no token is provided', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        })

        it('should return 400 if token is invalid', async () => {
            token = 'a';
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should return 200 if token is invalid', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
        })

    });
})