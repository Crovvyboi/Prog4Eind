const app = require("../app");
const chaiHTTP = require("chai-http");
const chai = require("chai");
const { Server } = require("http");
const { exit } = require("process");

var db = require('../sqlite_db/db');
require('dotenv').config();

let assert = require('assert').strict;

const {expect} = chai;
chai.use(chaiHTTP);

describe('Assert API', function() {
    describe('Call user functions', function () {
        it('/api/users', function(done) {
            chai
            .request(app)
            .get('/api/users')
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(200);
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

        it('/api/users/post', function(done) {
            chai
            .request(app)
            .post('/api/users/post')
             .send(newUser)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(201);
                done();
            });
        });

        it('/api/users/profile', function(done) {
            chai
            .request(app)
            .get('/api/users/profile')
             .send(newUser)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(200);
                done();
            });
        });

        const id = {
            "id": '3',
            "isActive": 1
        }

        it('/api/users/id', function(done) {
            chai
            .request(app)
            .get('/api/users')
             .send(id.id)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(200);
                done();
            });
        });

        it('/api/users/id&isActive', function(done) {
            chai
            .request(app)
            .get('/api/users')
             .send(id)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(200);
                done();
            });
        });

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

        it('/api/users/update', function(done) {
            chai
            .request(app)
            .put('/api/users/update')
             .send(updatedUser)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(200);
                done();
            });
        });

        const deleteUser = {
            "email": "this2@email.com",
            "password": "pw"
        }

        it('/api/users/remove', function(done) {
            chai
            .request(app)
            .del('/api/users/remove')
             .send(deleteUser)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(200);
                done();
            });
        });

    });
    describe('Call meal functions', function () {
        
        it('/api/meals', function(done) {
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

        it('/api/meals/post', function(done) {
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

        it('/api/meals/update', function(done) {
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

        it('/api/meals/remove', function(done) {
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
