const request = require('supertest');
const {genre} = require('../../model/genre');
const {user} = require('../../model/users');
let server;

describe('/api/genres', () => {
    beforeEach(() => {
       server = require('../../index');
    });
    afterEach(async () => {
       await server.close();
   //    await genre.remove({});
    })
    xdescribe('GET/', () => {
        it('should return all genres', async () => {
            await genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'}
            ]);
            console.log(request);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => {
                return g.name === 'genre1'
            })).toBeTruthy();
            expect(res.body.some(g => {
                return g.name === 'genre2'
            })).toBeTruthy();
        });
    })
    xdescribe('/GET :/id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genres = new genre({movie: 'genre3'});
            await genres.save();
            const res = await request(server).get('/api/genres/' + genres._id);
            expect(res.status).toBe(200);
           // expect(res.body.length).toBe(4); // will not work as it is not an arry so no length property can be used
           // expect(res.body).toMatchObject(genres); // (may not work)
           expect(res.body).toHaveProperty('movie', genres.movie);
        });

        it('should return a 404 if invalid id is passed', async () => {
            // const genres = new genre({name: 'genre1'});
            // await genres.save();
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
               // expect(res.body).toMatchObject(genre); (may not work)
             //  expect(res.body).toHaveProperty('name', genres.name);

        });
    })
    xdescribe('Post authorization', () => {

      // Define happy path and then in each test, we change one parameter that clearly
      // aligns with the name of the test
      
      let token;
      let movie;

      const exec = async () => {
        return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ 
                movie,
                genre: 'Romance'
             });
      }

      beforeEach(() => {
        token = new user().generateAuthToken();
        movie = 'Deewana'
      })

      it('should return an error if user is not logged in', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
      });

      it('should return 400 if genre is less than 5 characters', async () => {
        movie = 'Darr';
        const res = await exec();
        expect(res.status).toBe(400);
      });

      it('should return 400 if genre is more than 50 characters', async () => {
        movie = new Array(52).join('a');

        const res = await exec();
        expect(res.status).toBe(400);
      });

      it('should save the genre if it is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('movie', 'Deewana');
        // const result = await genre.find({movie: 'Deewana'});
        // expect(result).not.toBeNull();
      });
    });
    xdescribe('Put authorization', () => {
      let token;
      let movie;
      let newMovie;

      const exec = async () => {
        return await request(server)
        .put('/api/genres/' + movie)
        .set('x-auth-token', token)
        .send({ 
                movie: newMovie
             });
      }

      beforeEach(() => {
        token = new user().generateAuthToken();
        movie = 'Deewana';
        newMovie = 'Baazigar';

      })
      
      it('should update the resource with a new movie name', async () => {
        const res = await exec();
        const updatedGenre = await genre.find({ movie: 'Baazigar'})
        expect(updatedGenre).toBeDefined();
      });

      xit('should return error if invalid name', async () => {
        movie = 1;
        const res = await exec();
        expect(res.status).toBe(400);
      });

      xit('should return error if genre with the given name was not found', async () => {
        movie = 'Darr';
        const res = await exec();
        expect(res.status).toBe(400);
      });
    })

    // describe('DELETE /:movie', () => {
    //   let token; 
    //   let genreElement; 
    //   let movie; 
  
    //   const exec = async () => {
    //     return await request(server)
    //       .delete('/api/genres/' + movie)
    //       .set('x-auth-token', token)
    //       .send();
    //   }
  
    //   beforeEach(async () => {
    //     // Before each test we need to create a genre and 
    //     // put it in the database.      
    //     genreElement = new genre({ movie : 'genre1', genre : "Action" });
    //     await genreElement.save();
        
    //     movie = 'genre1'; 
    //     token = new user({ isAdmin: true }).generateAuthToken();     
    //   })

    //   it('should delete the genre if input is valid', async () => {
    //     const res = await exec();
    //     expect(res.body.length).toBe(3);
  
    //    // const genreInDb = await genre.find({movie: 'genre1'});
  
    //     // expect(genreInDb).toBeNull();
    //   });

    // });
})
