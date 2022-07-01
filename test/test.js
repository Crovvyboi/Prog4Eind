process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal-testdb'
process.env.LOGLEVEL = 'warn'

const app = require("../app");
const chaiHTTP = require("chai-http");
const chai = require("chai");
var db = require('../sqlite_db/db');
const jwt = require('jsonwebtoken')
require('dotenv').config();

let assert = require('assert').strict;

const {expect} = chai;
chai.should();
chai.use(chaiHTTP);

/**
 * Db queries to clear and fill the test database before each test.
 */
const CLEAR_MEAL_TABLE = "DELETE FROM meal; "
const CLEAR_PARTICIPANTS_TABLE = "DELETE FROM meal_participants_user; "
const CLEAR_USERS_TABLE = "DELETE FROM user; "

/**
 * Voeg een user toe aan de database. Deze user heeft id 1.
 * Deze id kun je als foreign key gebruiken in de andere queries, bv insert meal.
 */
const INSERT_USER =
    'INSERT INTO user (id, firstName, lastName, emailAdress, password, street, city ) VALUES ' +
    '(1, "first", "last", "name@server.nl", "secret", "street", "city");'

/**
 * Query om twee meals toe te voegen. Let op de cookId, die moet matchen
 * met een bestaande user in de database.
 */
const INSERT_MEALS =
    'INSERT INTO meal (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' +
    "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
    "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);"

describe('Assert API', function() {
    before((done) => {
        console.log(
            'before: hier zorg je eventueel dat de precondities correct zijn'
        )
        console.log('before done')
        done()
    })



    describe('Call user functions', function () {
        beforeEach((done) => {
            console.log('beforeEach called')
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            db.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                // Each query has to be executed seperately, since combining these will result in an error
                // Tested the combined queries externally, returned an error
                connection.query(
                    CLEAR_MEAL_TABLE,
                    function (error, results, fields) {
                        // Handle error after the release.
                        if (error) throw error
                    }
                )
                connection.query(
                    CLEAR_PARTICIPANTS_TABLE,
                    function (error, results, fields) {
                        // Handle error after the release.
                        if (error) throw error
                    }
                )
                connection.query(
                    CLEAR_USERS_TABLE,
                    function (error, results, fields) {
                        // Handle error after the release.
                        if (error) throw error
                    }
                )
                connection.query(
                    INSERT_USER,
                    function (error, results, fields) {
                        // Handle error after the release.
                        if (error) throw error
                    }
                )
                connection.query(
                    INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()

                        // Handle error after the release.
                        if (error) throw error

                        done()
                    }
                )

                console.log('beforeEach executed!')

            })
        })

        // Cover errors
        // Specify result tests
        // Check status codes
        // Add authorization headers
        it('/api/users', (done) => {
            chai
            .request(app)
            .get('/api/users')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
            )
            .end((err, res) => {
                assert.ifError(err)
                res.should.have.status(200);
                res.should.be.an('object');
                done();
            });
        });

        it('/api/users?id=3', function(done) {
            chai
            .request(app)
            .get('/api/users?id=3')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
            )
            .end((err, res) => {
                assert.ifError(err)
                res.should.have.status(200);
                res.should.be.an('object');
                done();
            });
        });

        it('/api/users?isActive=1', function(done) {
            chai
            .request(app)
            .get('/api/users?isActive=1')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
            )
            .end((err, res) => {
                assert.ifError(err)
                res.should.have.status(200);
                res.should.be.an('object');
                done();
            });
        });

        it.skip('/api/users?id=3&isActive=1', function(done) {
            chai
            .request(app)
            .get('/api/users?id=3&isActive=1')
            .end((err, res) => {
                assert.ifError(err)
                res.should.have.status(200);
                res.should.be.an('object');
                done();
            });
        });

        const newUser = {
            "firstname": "John",
            "lastname": "Doe",
            "isActive": 0,
            "email": "this2@email.com",
            "password": "pw",
            "phonenumber": "87 654321",
            "roles":  "guest",
            "street": "Street 10",
            "city": "City"

        }

        it.skip('/api/users/post', function(done) {
            chai
            .request(app)
            .post('/api/users')
             .send(newUser)
            .end((err, res) => {
                assert.ifError(err)
                res.should.have.status(201);
                res.should.be.an('object');
                done();
            });
        });

        it.skip('/api/users/profile', function(done) {
            chai
            .request(app)
            .get('/api/users')
             .send(newUser)
            .end((err, res) => {
                assert.ifError(err)
                res.should.have.status(200);
                res.should.be.an('object');
                done();
            });
        });

        // const id = {
        //     "id": '3',
        //     "isActive": 1
        // }

        // it.skip('/api/users/id', function(done) {
        //     chai
        //     .request(app)
        //     .get('/api/users')
        //      .send(id.id)
        //     .end((err, res) => {
        //         assert.ifError(err)
        //         res.should.have.status(200);
        //         res.should.be.an('object');
        //         done();
        //     });
        // });

        // it.skip('/api/users/id&isActive', function(done) {
        //     chai
        //     .request(app)
        //     .get('/api/users')
        //      .send(id)
        //     .end((err, res) => {
        //         if (err) {
        //             done(err);
        //         }
        //         expect(res).to.have.status(200);
        //         done();
        //     });
        // });

        const updatedUser = {
            "firstname": "Sarah",
            "lastname": "Doe",
            "isActive": 1,
            "emails": "this2@email.com",
            "phonenumber": "87 654321",
            "roles":  "guest",
            "street": "Street 10",
            "city": "City",
            "password": "pw"
        }

        it.skip('/api/users/update', function(done) {
            chai
            .request(app)
            .put('/api/users')
             .send(updatedUser)
            .end((err, res) => {
                assert.ifError(err)
                res.should.have.status(200);
                res.should.be.an('object');
                done();
            });
        });

        const deleteUser = {
            "email": "this2@email.com",
            "password": "pw"
        }

        it.skip('/api/users/remove', function(done) {
            chai
            .request(app)
            .del('/api/users')
             .send(deleteUser)
            .end((err, res) => {
                assert.ifError(err)
                res.should.have.status(200);
                res.should.be.an('object');
                done();
            });
        });

    });
    describe('Call meal functions', function () {
        
        it.skip('/api/meals', function(done) {
            chai
            .request(app)
            .get('/api/meals')
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(200);
                done();
            });
        });
        
        const newmeal = {
            "emailAdress": "m.vandam@server.nl",
            "password": "secret",
        
            "isActive": "1", 
            "isVega": "0", 
            "isVegan": "0", 
            "isToTakeHome": "1", 
            "dateTime": "2022-03-22 17:35:00", 
            "maxAmountOfParticipants": "4", 
            "price": "12.75", 
            "imageUrl": "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg", 
            "cookId": "4", 
            "createDate": "2022-02-26 18:12:40.048998", 
            "updateDate": "2022-04-26 12:33:51.000000", 
            "name": "testmeal", 
            "description": "description", 
            "allergenes": "gluten,lactose"
        }

        it.skip('/api/meals/post', function(done) {
            chai
            .request(app)
            .post('/api/meals/post')
             .send(newmeal)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(201);
                done();
            });
        });

        const updatemeal = {
            "emailAdress": "m.vandam@server.nl",
            "password": "secret",
        
            "isActive": "1", 
            "isVega": "1", 
            "isVegan": "1", 
            "isToTakeHome": "1", 
            "dateTime": "2022-03-22 17:35:00", 
            "maxAmountOfParticipants": "4", 
            "price": "12.75", 
            "imageUrl": "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg", 
            "cookId": "4", 
            "createDate": "2022-02-26 18:12:40.048998", 
            "updateDate": "2022-04-26 12:33:51.000000", 
            "name": "testmeal", 
            "description": "description", 
            "allergenes": "gluten,lactose"
        }

        it.skip('/api/meals/update', function(done) {
            chai
            .request(app)
            .put('/api/meals/update')
             .send(updatemeal)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(200);
                done();
            });
        });

        const removemeal = {
            "emailAdress": "m.vandam@server.nl",
            "password": "secret",
        
            "mealname": "testmeal",
            "userId": "4"
        }

        it.skip('/api/meals/remove', function(done) {
            chai
            .request(app)
            .del('/api/meals/remove')
             .send(removemeal)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(200);
                done();
            });
        });
    });
});
