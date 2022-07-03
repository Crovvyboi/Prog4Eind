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
        describe('User get tests', function () {


            it('UC-202-1: toon nul gebruikers', (done) => {
                chai
                .request(app)
                .get('/api/users?firstname=90')
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

            it('UC-202-2: toon 2 gebruikers', (done) => {
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
            
            it('TC-202-3: toon gebruikers met zoekterm op niet bestaande naam', function(done) {
                chai
                .request(app)
                .get('/api/users?firstname="Gloopglob"')
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

            it('UC-202-4: toon gebruikers met gebruik van de zoekterm op het veld "isActive"=false', function(done) {
                chai
                .request(app)
                .get('/api/users?isActive=0')
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

            it('UC-202-5: toon gebruikers met gebruik van de zoekterm op het veld "isActive"=true', function(done) {
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

            it('TC-202-3: toon gebruikers met zoekterm op bestaande naam', function(done) {
                chai
                .request(app)
                .get('/api/users?firstname="first"')
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

            it('TC-204-1: ongeldige token', function(done) {
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

            it('TC-204-2: gebruiker-id bestaat niet', function(done) {
                chai
                .request(app)
                .get('/api/users/profile')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 0 }, "secretstring")
                )
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(404);
                    res.should.be.an('object');
                    done();
                });

            });

            it('TC-204-3: gebruiker-id bestaat', function(done) {
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

    });
});