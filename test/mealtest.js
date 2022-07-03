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
    describe('Test meal functions', function () {
        describe('Create meal', function () {
            it('301-1: verplicht veld ontbreekt', function(done) {
    
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
                    "name": "", 
                    "description": "description", 
                    "allergenes": "gluten,lactose"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400);
                    res.should.be.an('object');
                    done();
                });
    
            });

            it('301-2: niet ingelogd', function(done) {

                chai
                .request(app)
                .post('/api/meals')
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
                    assert.ifError(err)
                    res.should.have.status(401);
                    res.should.be.an('object');
                    done();
                });
    
            });
    
    
            it('301-3: maaltijd succesvol toegevoegd', function(done) {
    
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
                    assert.ifError(err)
                    res.should.have.status(201);
                    res.should.be.an('object');
                    done();
                });
    
            });
        })

        describe('Update meal', function () {
            
            it('302-1: maaltijd succesvol gewijzigd', function(done) {
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
                    "price": "", 
                    "imageUrl": "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg", 
                    "createDate": "2022-02-26 18:12:40.048998", 
                    "updateDate": "2022-04-26 12:33:51.000000", 
                    "name": "", 
                    "description": "description", 
                    "allergenes": "gluten,lactose"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(400);
                    res.should.be.an('object');
                    done()
                });
            })

            it('302-2: niet ingelogd', function(done) {
                chai
                .request(app)
                .put('/api/meals')
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
                    "name": "Meal A", 
                    "description": "description", 
                    "allergenes": "gluten,lactose"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401);
                    res.should.be.an('object');
                    done()
                });
            })

            it('302-3: niet de eigenaar van de data', function(done) {
                chai
                .request(app)
                .put('/api/meals')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 4 }, "secretstring")
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
                    "name": "Meal A", 
                    "description": "description", 
                    "allergenes": "gluten,lactose"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(403);
                    res.should.be.an('object');
                    done()
                });
    
            });

            it('302-4: maaltijd bestaat niet', function(done) {
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
                    "name": "test", 
                    "description": "description", 
                    "allergenes": "gluten,lactose"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(404);
                    res.should.be.an('object');
                    done()
                });
    
            });

            it('302-5: maaltijd succesvol gewijzigd', function(done) {
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
                    "name": "Meal A", 
                    "description": "description", 
                    "allergenes": "gluten,lactose"
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200);
                    res.should.be.an('object');
                    done()
                });
    
            });
        })

        describe('Get meal' , function () {
            it('UC-303 lijst van maaltijden geretourneerd', function(done) {
                chai
                .request(app)
                .get('/api/meals')
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

            it('UC-304-2: maaltijd bestaat niet', function(done) {
                chai
                .request(app)
                .get('/api/meals?id=0')
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

            it('UC-304-2: details van maaltijd geretourneerd', function(done) {
                chai
                .request(app)
                .get('/api/meals?id=1')
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

        describe('Delete meal', function () {
            it('305-2: niet ingelogd', (done) => {
                chai
                .request(app)
                .del('/api/meals')
                 .send(removemeal = {
                    "mealname": "Meal A",
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401);
                    res.should.have.an('object')
    
                    done()
                })
            })

            it('305-3: niet de eigenaar van de data', (done) => {
                chai
                .request(app)
                .del('/api/meals')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 8 }, "secretstring")
                )
                 .send(removemeal = {
                    "mealname": "Meal A",
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(403);
                    res.should.have.an('object')
    
                    done()
                })
    
            })

            it('305-4: maaltijd bestaat niet', (done) => {
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
                    assert.ifError(err)
                    res.should.have.status(404);
                    res.should.have.an('object')
    
                    done()
                })
    
            })

            it('305-5: maaltijd succesvol verwijderd', (done) => {
                chai
                .request(app)
                .del('/api/meals')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, "secretstring")
                )
                 .send(removemeal = {
                    "mealname": "Meal A",
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200);
                    res.should.have.an('object')
    
                    done()
                })
    
            })
        })
    })
});