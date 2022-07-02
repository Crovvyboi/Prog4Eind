

const app = require("../app");
const chaiHTTP = require("chai-http");
const chai = require("chai");
var db = require('../sqlite_db/db');
const jwt = require('jsonwebtoken');
const { exit } = require("process");
require('dotenv').config();

let assert = require('assert').strict;

const {expect} = chai;
chai.should();
chai.use(chaiHTTP);

process.env.DB_DATABASE = 'share_a_meal_testdb'
process.env.LOGLEVEL = 'warn'

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
    "INSERT INTO user (id, firstName, lastName, emailAdress, password, street, city ) VALUES " +
    "(1, 'first', 'last', 'name@server.nl', 'secret', 'street', 'city');"

/**
 * Query om twee meals toe te voegen. Let op de cookId, die moet matchen
 * met een bestaande user in de database.
 */
const INSERT_MEALS =
    "INSERT INTO meal (id, name, description, imageUrl, dateTime, maxAmountOfParticipants, price, cookId) VALUES" +
    "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
    "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);"

describe('Assert API', function() {

    describe('Test user functions', function () {
        // Cover errors
        // Specify result tests
        // Check status codes & describe tests better

        describe('User get tests', function () {


            it('200: get all users', (done) => {
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

            it('400: cannot get user on id 1', function(done) {
                chai
                .request(app)
                .get('/api/users?id=0')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400);
                    res.should.be.an('object');
                    done();
                });
            });
            
            it('200: get user on id 1', function(done) {
                chai
                .request(app)
                .get('/api/users?id=1')
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

            it('400: cannot get user on isActive', function(done) {
                chai
                .request(app)
                .get('/api/users?isActive=2')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400);
                    res.should.be.an('object');
                    done();
                });
            });
    
            it('200: get all active users', function(done) {
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

            it('400: cannot get user on correct isActive & incorrect id', function(done) {
                chai
                .request(app)
                .get('/api/users?id=0&isActive=1')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400);
                    res.should.be.an('object');
                    done();
                });
            });

            it('400: cannot get user on incorrect isActive & correct id', function(done) {
                chai
                .request(app)
                .get('/api/users?id=1&isActive=2')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400);
                    res.should.be.an('object');
                    done();
                });
            });

            it('400: cannot get user on incorrect isActive & incorrect id', function(done) {
                chai
                .request(app)
                .get('/api/users?id=0&isActive=2')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400);
                    res.should.be.an('object');
                    done();
                });
            });
    
            it('200: get active user on id 1', function(done) {
                chai
                .request(app)
                .get('/api/users?id=1&isActive=1')
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

            it('401: missing Authheader', function(done) {
                chai
                .request(app)
                .get('/api/users/profile')
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401);
                    res.should.be.an('object');
                    done();
                });
            });

            it('401: not authorized', function(done) {
                chai
                .request(app)
                .get('/api/users/profile')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secrering")
                )
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401);
                    res.should.be.an('object');
                    done();
                });
            });

            it('400: could not get user on token id', function(done) {
                chai
                .request(app)
                .get('/api/users/profile')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 0 }, "secretstring")
                )
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400);
                    res.should.be.an('object');
                    done();
                });
            });

            it('200: get profile of logged in user', function(done) {
                chai
                .request(app)
                .get('/api/users/profile')
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
        })

        describe('Insert user', function () {
            it('400: contains empty field', function(done) {
                chai
                .request(app)
                .post('/api/users')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                 .send(newUser = {
                    "firstname": "John",
                    "lastname": "Doe",
                    "isActive": 0,
                    "email": "this2@email.com",
                    "password": "pw",
                    "roles":  "guest",
                    "street": "Street 10",
                    "city": "City"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400);
                    res.should.be.an('object');
                    done();
                });
            });
    
            it('400: email does not meet standard', function(done) {
                chai
                .request(app)
                .post('/api/users')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                 .send(newUser = {
                    "firstname": "John",
                    "lastname": "Doe",
                    "isActive": 0,
                    "email": "this2email.com",
                    "password": "pw",
                    "phonenumber": "87 654321",
                    "roles":  "guest",
                    "street": "Street 10",
                    "city": "City"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400);
                    res.should.be.an('object');
                    done();
                });
            });
    
            it('201: insert new user', function(done) {
                chai
                .request(app)
                .post('/api/users')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                 .send(newUser = {
                    "firstname": "John",
                    "lastname": "Doe",
                    "isActive": 0,
                    "email": "this2@email.com",
                    "password": "pw",
                    "phonenumber": "87 654321",
                    "roles":  "guest",
                    "street": "Street 10",
                    "city": "City"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(201);
                    res.should.be.an('object');
                    done();
                });
            });
    
            it('409: user already exists', function(done) {
                chai
                .request(app)
                .post('/api/users')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                 .send(newUser = {
                    "firstname": "John",
                    "lastname": "Doe",
                    "isActive": 0,
                    "email": "name@server.nl",
                    "password": "pw",
                    "phonenumber": "87 654321",
                    "roles":  "guest",
                    "street": "Street 10",
                    "city": "City"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(409);
                    res.should.be.an('object');
                    done();
                });
            });
        })

        describe('Update user', function () {
            it('400: phonenumber does not meet standard', function(done) {
                chai
                .request(app)
                .put('/api/users')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                 .send(updatedUser = {
                    "firstname": "Sarah",
                    "lastname": "Doe",
                    "isActive": 1,
                    "emails": "this2@email.com",
                    "phonenumber": "87 65p",
                    "roles":  "guest",
                    "street": "Street 10",
                    "city": "City",
                    "password": "pw"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400);
                    res.should.be.an('object');
                    done();
                });
            });

            it('400: cannot update new user', function(done) {
                chai
                .request(app)
                .put('/api/users')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                 .send(updatedUser = {
                    "firstname": "Sarah",
                    "lastname": "Doe",
                    "isActive": 1,
                    "phonenumber": "87 654321",
                    "roles":  "guest",
                    "street": "Street 10",
                    "city": "City",
                    "password": "p841w"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200);
                    res.should.be.an('object');
                    done();
                });
            });

            it('200: update new user', function(done) {
                chai
                .request(app)
                .put('/api/users')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                 .send(updatedUser = {
                    "firstname": "Sarah",
                    "lastname": "Doe",
                    "isActive": 1,
                    "emails": "this2@email.com",
                    "phonenumber": "87 654321",
                    "roles":  "guest",
                    "street": "Street 10",
                    "city": "City",
                    "password": "pw"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200);
                    res.should.be.an('object');
                    done();
                });
            });
        })

        describe('Remove user', function () {
            it('200: remove new user', function(done) {
                chai
                .request(app)
                .del('/api/users')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                 .send(deleteUser = {
                    "email": "this2@email.com",
                    "password": "pw"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200);
                    res.should.be.an('object');
                    done();
                });
            });
        })

    });

    describe('Test meal functions', function () {
        
        it('200: get all meals', function(done) {
            chai
            .request(app)
            .get('/api/meals')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
            )
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(200);
                done();
            });
        }); 

        it('401: not authorized', function(done) {

            chai
            .request(app)
            .post('/api/meals')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ id: 1 }, "sectring")
            )
             .send(newmeal = {
                "isActive": "1", 
                "isVega": "0", 
                "isVegan": "0", 
                "isToTakeHome": "1", 
                "dateTime": "2022-03-22 17:35:00", 
                "maxAmountOfParticipants": "4", 
                "price": "12.75", 
                "imageUrl": "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg", 
                "createDate": "2022-02-26 18:12:40.048998", 
                "updateDate": "2022-04-26 12:33:51.000000", 
                "name": "testmeal", 
                "description": "description", 
                "allergenes": "gluten,lactose"
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(401);
                done();
            });
        });

        it('201: place new meal', function(done) {

            chai
            .request(app)
            .post('/api/meals')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
            )
             .send(newmeal = {
                "isActive": "1", 
                "isVega": "0", 
                "isVegan": "0", 
                "isToTakeHome": "1", 
                "dateTime": "2022-03-22 17:35:00", 
                "maxAmountOfParticipants": "4", 
                "price": "12.75", 
                "imageUrl": "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg", 
                "createDate": "2022-02-26 18:12:40.048998", 
                "updateDate": "2022-04-26 12:33:51.000000", 
                "name": "testmeal", 
                "description": "description", 
                "allergenes": "gluten,lactose"
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(201);
                done();
            });
        });

        it('200: update meal', function(done) {

            chai
            .request(app)
            .put('/api/meals')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
            )
             .send(updatemeal = {
                "isActive": "1", 
                "isVega": "1", 
                "isVegan": "1", 
                "isToTakeHome": "1", 
                "dateTime": "2022-03-22 17:35:00", 
                "maxAmountOfParticipants": "4", 
                "price": "12.75", 
                "imageUrl": "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg", 
                "createDate": "2022-02-26 18:12:40.048998", 
                "updateDate": "2022-04-26 12:33:51.000000", 
                "name": "testmeal", 
                "description": "description", 
                "allergenes": "gluten,lactose"
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(200);
                done();
            });
        });

        // Get user id with token
        it('200: remove meal', function(done) {
            chai
            .request(app)
            .del('/api/meals')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
            )
             .send(removemeal = {
                "mealname": "testmeal",
            })
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
