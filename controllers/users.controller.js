const jwt = require('jsonwebtoken');

// Connect to db
var db = require('../sqlite_db/db');
require('dotenv').config();

module.exports = {
    /* GET user listing. */
    getUsers: (req, res, next) => {

        let {id, isActive, firstname} = req.query;

        let sql = 'Select * From user';

        // Check if there are inserted parameters (id / isActive)
        if (id || isActive || firstname) {
            sql += ' Where '
            if (id) {
               sql += `id = ` + id
            }
            if (id && isActive) {
                sql += ' And '
            }
            if (isActive) {
                sql += `isActive = ` + isActive
            }
            if (id && firstname || isActive && firstname) {
                sql += ' And '
            }
            if (firstname) {
                sql += `firstname = ` + firstname
            }

            db.getConnection(function (err, connection) {
                if (err) res.status(500).json({
                statusCode: "500",
                message: "Connection error"
                });
                connection.query(sql, [id, isActive], function (error, results, fields) {
                connection.release();
    
                if (results.length == 0 && id) {
                    res.status(404).json({
                        statusCode: "404",
                        results: "No users found on this id"
                    });
                }
                else {
                    console.log('#results = ' + results.length);
                        
    
                        res.status(200).json({
                            statusCode: "200",
                            results: results
                        });
                    }
                });
            });
        }
        else{
            db.getConnection(function (err, connection) {
                if (err) res.status(500).json({
                statusCode: "500",
                message: "Connection error"
                });
                connection.query(sql, [id, isActive], function (error, results, fields) {
                connection.release();
    

                console.log('#results = ' + results.length);
                    

                res.status(200).json({
                    statusCode: "200",
                    results: results
                });

                });
            });
        }


    },
  
    addUser: (req, res, next) => {
        let sql = "Insert Into user (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) " + " Values(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let checkusersql = "Select * From user Where emailAdress = '?'"
    
        if (req.body.firstname == null ||
            req.body.lastname == null || 
            req.body.isActive == null ||  
            req.body.email == null ||  
            req.body.password == null ||  
            req.body.phonenumber == null ||  
            req.body.roles == null ||  
            req.body.street == null ||  
            req.body.city == null
        ) {
        res.status(400).json({
            statusCode: "400",
            message: "Required field empty"
        });
        }
        else {
            // Insert email RegEx
            let regExemail =  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
            let regExpassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
            if (!regExemail.test(req.body.email)) {
                res.status(400).json({
                    statusCode: "400",
                    message: "Email does not meet requirements"
                });
            }
            else if (!regExpassword.test(req.body.password)) {
                res.status(400).json({
                    statusCode: "400",
                    message: "Password does not meet requirements"
                });
            }
            else{
                    
                db.getConnection(function (err, connection) {
                    if (err) res.status(500).json({
                        statusCode: "500",
                        message: "Connection error"
                    })
                    else {
                        connection.query(checkusersql, [req.body.email], function(error, results, fields) {
                            if (results > 0) {
                            res.status(409).json({
                                statusCode: "409",
                                message: "User already exists",
                            });
                            }
                            else {
                                connection.query(sql, [req.body.firstname, req.body.lastname, req.body.isActive, req.body.email, req.body.password, req.body.phonenumber, req.body.roles, req.body.street, req.body.city], function(err, results) {
                                    if (err) {
                                        res.status(409).json({
                                        statusCode: "409",
                                        message: "Failed to insert!"
                                        });
                                    }
                                    else {
                                        res.status(201).json({
                                            statusCode: "201",
                                            message: "Inserted!",
                                            result: results
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    
        
    },
    
    // Use token to get profile
    getUserProfile: (req, res, next) => {
        db.getConnection(function (err, connection) {
        if (err) res.status(500).json({
            statusCode: "500",
            message: "Connection error"
        })

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
                    connection.query("Select * From user Where id = " + payload.id, function(err, data) {
                        if (data.length == 0) {
                            res.status(404).json({
                                statusCode: "404",
                                message: "Could not get user"
                            })
                        }
                        else {
                            res.status(200).json({
                            statusCode: "200",
                            results: data
                            });
                        }
                    });
                }
            })
        }});
    },

    
    updateUser: (req, res, next) => {
        let sql = "Update user Set firstName = '?', lastName = '?', street = '?', city = '?', isActive = '?', phoneNumber = '?' " +
        "Where emailAdress = ? And password = ?";
    
        // Check phonenumber regex
        let phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
        if (!phoneRegex.test(req.body.phonenumber)) {
            res.status(400).json({
                statusCode: "400",
                message: "Phonenumber does not meet standard expression"
            });
        }
        else
        {
            if (req.body.email == "") {
                res.status(400).json({
                    statusCode: "400",
                    message: "Email is empty"
                });
            }
            else {
                
                db.getConnection(function (err, connection) {
                    if (err) res.status(500).json({
                        statusCode: "500",
                        message: "Connection error"
                    });
    
                    let checkuser = "Select * From user Where emailAdress = ?"
                    connection.query(checkuser, [req.body.email], function(err, results) {
                        if (err) {

                            console.log(err);
                            res.status(400).json({
                                status: "400",
                                message: "Failed to execute query!"
                            });
                        }
                        else 
                        {
                            if (results.length > 0) {
                                connection.query(sql, [req.body.firstname, req.body.lastname, req.body.street, req.body.city, req.body.isActive, req.body.phonenumber, req.body.email, req.body.password], function(err, results) {
                                    if (err) {
                                    console.log(err);
                                    res.status(400).json({
                                        status: "400",
                                        message: "Failed to update!"
                                    });
                                    }
                                    else {
                                        res.status(200).json({
                                            status: "200",
                                            message: "Updated!",
                                            results: results
                                        });
                                    }
                            
                
                                });
                            }
                            else 
                            {
                                res.status(400).json({
                                    status: "400",
                                    message: "User does not exist"
                                });
                            }
                        }
    
                        
                    });
                });
            }
        } 
    },
    
    deleteUser: (req, res, next) => {

        let sql = "Delete From user " +
        "Where emailAdress = '?' And password = '?'";
        let finduser = "Select id from user Where emailAdress = ?"
    
        db.getConnection(function (err, connection) {
        if (err) res.status(500).json({
            statusCode: "500",
            message: "Connection error"
        });

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
                    res.status(400).json({
                        error: 'Not authorized',
                        datetime: new Date().toISOString(),
                    })
                }
                if (payload) {
                    connection.query(finduser, [req.body.email], function (err, results) {
                        if (err) {
                            console.log(err);
                            res.status(400).json({
                                status: "400",
                                message: "Failed to execute query!"
                            })
                        }
                        else 
                        {
                            if (results.length > 0) {
                                if (results[0].id == payload.id) {
                                    let removecook = "Delete From meal Where cookId = " + payload.id
                                    connection.query(removecook, function () {
                                        if (err) {
                                            console.log(err);
                                            res.status(400).json({
                                                status: "400",
                                                message: "Failed to delete from meals!"
                                            });
                                        }
                                        else {
                                            connection.query(sql, [req.body.email, req.body.password], function(err, results) {
                                                if (err) {
                                                console.log(err);
                                                res.status(400).json({
                                                    status: "400",
                                                    message: "Failed to delete!"
                                                });
                                                }
                                                else {
                                                    res.status(200).json({
                                                        status: "200",
                                                        message: "Removed!",
                                                        results: results
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                                else 
                                {
                                    res.status(403).json({
                                        status: "403",
                                        message: "User does not own account"
                                    });
                                }                                
                            }
                            else
                            {
                                res.status(400).json({
                                    status: "400",
                                    message: "No user found on email"
                                });
                            }
                        }
                    }
                )}
            })}
        }
    )}
}
