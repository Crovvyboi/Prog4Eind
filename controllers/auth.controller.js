const jwt = require('jsonwebtoken')
const db = require('../sqlite_db/db');
const assert = require('assert')

module.exports = {
    login: (req, res, next) => {

        const {emailAdress, password} = req.body;

        if (emailAdress == '' || password == '') {
            return res.status(400).json({
                statusCode: "400",
                message: "Required field missing!"
            });
        }
        else 
        {
            let regEx =  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
            if (!regEx.test(emailAdress)) {
                res.status(400).json({
                    statusCode: "400",
                    message: "Email does not meet requirements"
                });
            }
            else{
                const queryString = "Select id, firstName, lastName, emailAdress, password From user Where emailAdress = ?";
    
                db.getConnection(function (err, connection) {
                    if (err) res.status(500).json({
                      statusCode: "500",
                      message: "Connection error"
                    });
                
                    if (connection) {
                        connection.query(queryString, [emailAdress], function(err, rows) {
                            if (err) {
                              console.log(err);
                              res.status(400).json({
                                statusCode: "400",
                                message: "Could not run query"
                              });
                            }
                            if (rows && rows.length === 0) {
                                res.status(404).json({
                                    statusCode: "404",
                                    message: "Gebruiker bestaat niet"
                                });
                            }      
                            else if (rows) {
                                if (rows && rows.length === 1 && rows[0].password === password) {
        
                
                                    jwt.sign({ userid: rows[0].id }, 'secretstring', {expiresIn: '1h'},  function(err, token) {
                                        if (err) {
                                            console.log(err)
                                        }
                                        if (token) {
                                            console.log("Login successful!")
                                           
                                            res.status(200).json({
                                                statusCode: 200,
                                                results: token
                                            })
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
                        });
                    }  
                });
            }
        }

        
    },

    validate: (req, res, next) => {
        const authHeader = req.header("Authorization")
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
    },

    validateLogin(req, res, next) {
        // Verify that we receive the expected input
        try {
            assert(
                typeof req.body.emailAdress === 'string',
                'email must be a string.'
            )
            assert(
                typeof req.body.password === 'string',
                'password must be a string.'
            )
            next()
        } catch (ex) {
            res.status(422).json({
                error: ex.toString(),
                datetime: new Date().toISOString(),
            })
        }
    }
}