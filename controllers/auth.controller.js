const jwt = require('jsonwebtoken')
const db = require('../sqlite_db/db');
const assert = require('assert')

module.exports = {
    login: (req, res, next) => {

        const {emailAdress, password} = req.body;

        const queryString = "Select id, firstName, lastName, emailAdress, password From user Where emailAdress = ?";

        db.getConnection(function (err, connection) {
            if (err) res.status(500).json({
              statusCode: "500",
              message: "Connection error"
            });
        
            connection.query(queryString, [emailAdress], function(err, results) {
              if (err) {
                console.log(err);
                res.status(400).json({
                  statusCode: "400",
                  message: "No user found with this email!"
                });
                throw err;
              }

              if (results && results.length === 1) {
                console.log(results[0])

                const user = results[0];

                if (user.password === password) {

                    jwt.sign({ userid: user.id }, 'secretstring', {expiresIn: '7d'},  function(err, token) {
                        if (err) {
                            console.log(err)
                        }
                        if (token) {
                            console.log("Login successful!")
                            console.log(token);
                            next()
                        }
                    
                    });
                }
                else {
                    res.status(400).json({
                        statusCode: "400",
                        message: "Password does not match"
                    });
                }

              }
              else {
                res.status(404).json({
                    statusCode: "404",
                    message: "No user id found"
                });
              }

              
            });
        });
    },

    validate: (req, res, next) => {
        const authHeader = req.headers.authorization || process.env.TOKEN_HEADER
        var jwtSecretKey = 'secretstring'
        if (!authHeader) {
            console.log('Authorization header missing!')
            res.status(401).json({
                error: 'Authorization header missing!',
                datetime: new Date().toISOString(),
            })
        } else {
            // Strip the word 'Bearer ' from the headervalue
            const token = authHeader.substring(7, authHeader.length)

            jwt.verify(token, jwtSecretKey, (err, payload) => {
                if (err) {
                    console.log('Not authorized')
                    res.status(401).json({
                        error: 'Not authorized',
                        datetime: new Date().toISOString(),
                    })
                }
                if (payload) {
                    console.log('token is valid', payload)
                    // User heeft toegang. Voeg UserId uit payload toe aan
                    // request, voor ieder volgend endpoint.
                    req.userId = payload.userId
                    next()
                }
            })
        }
    }
}