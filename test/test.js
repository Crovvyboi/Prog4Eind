const app = require("../app");
const chaiHTTP = require("chai-http");
const chai = require("chai");

let assert = require('assert').strict;

const {expect} = chai;
chai.use(chaiHTTP);

describe('Assert API', function() {
    describe('Call api functions', function () {
        it('/api/users', function(done) {
            chai
            .request(app)
            .put('/api/users')
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(202);
                done();
            });
        });

        const newUser = {
            "id": 1,
            "firstname": "John",
            "lastname": "Doe",
            "street": "Street 10",
            "city": "City",
            "isActive": false,
            "email": "this2@email.com",
            "password": "pw",
            "phonenumber": "87 654321"
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
             .send(newUser.email)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(202);
                done();
            });
        });

        it('/api/users/id', function(done) {
            chai
            .request(app)
            .get('/api/users/id')
             .send("1")
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res).to.have.status(202);
                done();
            });
        });

        const updatedUser = {
            "firstname": "Sarah",
            "lastname": "Doe",
            "street": "Street 20",
            "city": "City",
            "isActive": true,
            "email": "this2@email.com",
            "phonenumber": "87 654321",
            "id": 1,
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
                expect(res).to.have.status(205);
                done();
            });
        });

        const deleteUser = {
            "id": 1,
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
                expect(res).to.have.status(206);
                done();
            });
        });

    });
});