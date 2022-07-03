const app = require("../app");
const chaiHTTP = require("chai-http");
const chai = require("chai");
var db = require('../sqlite_db/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let assert = require('assert').strict;

const {expect} = chai;
chai.should();
chai.use(chaiHTTP);

process.env.DB_DATABASE = process.env.DB_DATABASE || 'share_a_meal_testdb'
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
        beforeEach((done) => {
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
                        // Handle error after the release.
                        if (error) throw error

                        // When done with the connection, release it.
                        connection.release()

                        done()
                    }
                )
    
            })
        })

        describe('Login test', function () {



            it('UC-101-1: verplicht veld ontbreekt', function(done) {
                chai
                .request(app)
                .post('/api/auth/login')
                .send({
                    "emailAdress": "",
                    "password": "secret"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400)
                    res.should.have.an('object')
                    done()
                })

            })

            it('UC-101-2: incorrect email', (done) => {
                chai
                .request(app)
                .post('/api/auth/login')
                .send({
                    "emailAdress": "namr.nl",
                    "password": "secret"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400)
                    res.should.have.an('object')
                    done();
                })

            })

            it('UC-101-3: incorrect password', (done) => {
                chai
                .request(app)
                .post('/api/auth/login')
                .send({
                    "emailAdress": "name@server.nl",
                    "password": "sret"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400)
                    res.should.have.an('object')
                    done();
                })
            })

            it('UC-101-4: gebruiker bestaat niet', (done) => {
                chai
                .request(app)
                .post('/api/auth/login')
                .send({
                    "emailAdress": "nme@server.nl",
                    "password": "secret"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(404)
                    res.should.have.an('object')
                    done();
                })
            })

            it('UC-101-5: successful login', (done) => {
                chai
                .request(app)
                .post('/api/auth/login')
                .send({
                    "emailAdress": "name@server.nl",
                    "password": "secret"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200)
                    res.should.have.an('object')
                    done();
                })
            })
        })

        describe('Insert user', function () {
            it('TC-201-1: verplicht veld ontbreekt', function(done) {
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
                    "password": "password2",
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
    
            it('TC-201-2: niet valide email adres', function(done) {
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
                    "password": "password2",
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

            it('TC-201-3: niet valide wachtwoord', function(done) {
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
                    "password": "p",
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

            it('TC-201-4: gebruiker bestaat al', function(done) {
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
                    "password": "password2",
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
    
            it('TC-201-5: gebruiker succesvol geregistreerd', function(done) {
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
                    "password": "password2",
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
    

        })

        describe('Update user', function () {
            it('TC-205-1: verplicht veld "emailAdress" ontbreekt', function(done) {
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
                    "emails": "",
                    "phonenumber": "87 654321",
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

            // TC-205-2 doorgestreept

            it('TC-205-3: niet-valide telefoonnummer', function(done) {
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
                    "emails": "name@server.nl",
                    "phonenumber": "87 65p",
                    "roles":  "guest",
                    "street": "Street 10",
                    "city": "City",
                    "password": "secret"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400);
                    res.should.be.an('object');
                    done();
                });

            });

            it('TC-205-4: gebruiker bestaat niet', function(done) {
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
                    "emails": "ts2@email.com",
                    "phonenumber": "87 65p",
                    "roles":  "guest",
                    "street": "Street 10",
                    "city": "City",
                    "password": "secret"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400);
                    res.should.be.an('object');
                    done();
                });

            });

            it('TC-205-5: niet ingelogd', function(done) {
                chai
                .request(app)
                .put('/api/users')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretring")
                )
                 .send(updatedUser = {
                    "firstname": "Sarah",
                    "lastname": "Doe",
                    "isActive": 1,
                    "phonenumber": "87 654321",
                    "roles":  "guest",
                    "street": "Street 10",
                    "city": "City",
                    "email": "name@server.nl",
                    "password": "secret"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401);
                    res.should.be.an('object');
                    done();
                });
            });

            it('TC-205-6: gebruiker succesvol gewijzigd', function(done) {
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
                    "street": "Street 10",
                    "city": "City",
                    "isActive": 1,
                    "phonenumber": "87 654321",
                    "email": "name@server.nl",
                    "password": "secret"
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
            it('TC-206-1: gebruiker bestaat niet', function(done) {
                chai
                .request(app)
                .del('/api/users')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                 .send(deleteUser = {
                    "email": "ne@server.nl",
                    "password": "secret"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400);
                    res.should.be.an('object');
                    done();
                })

            });

            it('TC-206-2: niet ingelogd', function(done) {
                chai
                .request(app)
                .del('/api/users')
                 .send(deleteUser = {
                    "email": "name@server.nl",
                    "password": "secret"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401);
                    res.should.be.an('object');
                    done();
                })

            });

            it('TC-206-3: actor is geen eigenaar', function(done) {
                chai
                .request(app)
                .del('/api/users')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 5 }, "secretstring")
                )
                 .send(deleteUser = {
                    "email": "name@server.nl",
                    "password": "secret"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(403);
                    res.should.be.an('object');
                    done();
                })

            });

            it('TC-206-4: gebruiker succesvol verwijderd', function(done) {
                chai
                .request(app)
                .del('/api/users')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                 .send(deleteUser = {
                    "email": "name@server.nl",
                    "password": "secret"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200);
                    res.should.be.an('object');
                    done();
                })

            });
        })

    });
});
