const { use } = require('chai');
const jwt = require('jsonwebtoken');

// Connect to db
var db = require('../sqlite_db/db');
require('dotenv').config();

module.exports = {
    addMeal: (req, res, next) => {
        let sql = "Insert Into meal ( isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookId, createDate, updateDate, name, description, allergenes) " + 
        " Values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        if (
            req.body.isActive == "" ||
            req.body.isVega == "" ||
            req.body.isVegan == "" ||
            req.body.isToTakeHome == "" ||
            req.body.dateTime == "" ||
            req.body.maxAmountOfParticipants == "" ||
            req.body.price == "" ||
            req.body.createDate == "" ||
            req.body.updateDate == "" ||
            req.body.name == "" ||
            req.body.allergenes == ""
        ) {
            res.status(400).json({
                statusCode: "400",
                message: "Missing required field"
                })
        }
        else {
            db.getConnection(function (err, connection) {
                if (err) res.status(500).json({
                statusCode: "500",
                message: "Connection error"
                })
                else {
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
                                const cookID = payload.id
                                connection.query(sql, [req.body.isActive, req.body.isVega, req.body.isVegan, req.body.isToTakeHome, req.body.dateTime, req.body.maxAmountOfParticipants, req.body.price, req.body.imageUrl, cookID, req.body.createDate, req.body.updateDate, req.body.name, req.body.description, req.body.allergenes], function(err, result) {
                                    if (err) {
                                        res.status(409).json({
                                        statusCode: "409",
                                        message: "Failed to insert!"
                                        });
                                    }
                                    else{
                                        res.status(201).json({
                                            statusCode: "201",
                                            // show inserted data
                                            message: "Inserted!",
                                            result: result
                                        });
                                    }
                                });
                            }
                        })
                    }
    
                }
                
    
            });
        }

        
    },

    updateMeal: (req, res, next) => {
        // Check if user owns meal through meal_participants_user
        let sql = "Update meal Set isActive = '?',  isVega = '?', isVegan = '?', isToTakeHome = '?', dateTime = '?' " +
        ", maxAmountOfParticipants = '?', price = '?', imageUrl = '?', cookId = '?', createDate = '?'" +
        ", updateDate = '?', name = '?', description = '?', allergenes = '?'" +
        "Where name = '?' and cookId = '?'";
        let getMealquery = "Select * From meal Where name = ?";

        if (
            req.body.maxAmountOfParticipants == "" ||
            req.body.price == "" ||
            req.body.name == "" 
        ) {
            res.status(400).json({
                statusCode: "400",
                message: "Missing required field"
                })
        }
        else {
            db.getConnection(function (err, connection) {
                if (err) res.status(500).json({
                statusCode: "500",
                message: "Connection error"
                })
                else {
                    connection.query(getMealquery, [req.body.name], function(err, results) {
                        if (err) {
                            res.status(500).json({
                                status: "500",
                                message: "Failed to execute getmeal query"
                            })
                        }
                        if (results.length == 0) {
                            res.status(404).json({
                            status: "404",
                            message: "Meal does not exist!"
                            });
                        }
                        else{
                            const cookID = results[0].cookId;

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
                                        const userid = payload.id
                                        console.log(this.cookID + " " + userid)

              
                                        if (cookID != userid) {
                                            res.status(403).json({
                                            status: "403",
                                            message: "User does not own meal!"
                                            });
                                        }
                                        else {

                                            connection.query(sql, [req.body.isActive, req.body.isVega, req.body.isVegan, req.body.isToTakeHome, req.body.dateTime, req.body.maxAmountOfParticipants, req.body.price, req.body.imageUrl, payload.id, req.body.createDate, req.body.updateDate, req.body.name, req.body.description, req.body.allergenes, req.body.name, payload.id], function(error, result) {
                                            if (error) {
                                                console.log(error);
                                                res.status(400).json({
                                                status: "400",
                                                message: "Failed to update!"
                                                });
                                            }
                                            else {
                                                res.status(200).json({
                                                    status: "200",
                                                    // Show updated data
                                                    message: "Updated!",
                                                    result: result
                                                    });
                                                }
                                            });
                                        }
                                    }
                                })
                            }   
                        }
                    })        
                }
            })
        }
    },

    getMeals: (req, res, next) => {
        let sql = 'Select * From meal';
    
        // Check for inserted parameters (name)
        const id = req.query.id

        if (id) {
            sql = sql + " Where id = " + id
        }

      
        db.getConnection(function (err, connection) {
            if (err) res.status(500).json({
              statusCode: "500",
              message: "Connection error"
            });
            connection.query(sql, function (error, results, fields) {
      
              if (error){
                res.status(400).json({
                  statusCode: "400",
                  message: "Could not execute query"
                })
              }
              if (results.length == 0) {
                res.status(400).json({
                    statusCode: "400",
                    message: "Meal does not exist"
                  })
              }
              else 
              {
                console.log('#results = ' + results.length);
                res.status(200).json({
                  statusCode: "200",
                  results: results
                });
              } 
            });
        });
    },

    removeMeal: (req, res, next) => {
        // Check if user owns meal through meal_participants_user
        let getMealquery = "Select * From meal Where name = ?";

    
        db.getConnection(function (err, connection) {
            if (err) res.status(500).json({
            statusCode: "500",
            message: "Connection error"
            });
    
            connection.query(getMealquery, [req.body.mealname], function(err, results) {
                if (err) {
                    res.status(500).json({
                        status: "500",
                        message: "Failed to execute getmeal query"
                    })
                }
                if (results.length < 1) {
                    res.status(404).json({
                    status: "404",
                    message: "Meal does not exist!"
                    });
                }
                else{
                    const cookID = results[0].cookId;
                    const mealid = results[0].id;

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
                                const userid = payload.id
                                
                                if (userid != cookID) {
                                    res.status(403).json({
                                    status: "403",
                                    message: "User does not own meal!"
                                    });
                                }
                                else {
                                    let deletequery = "Delete From meal Where id = '" + mealid + "' and cookId = '" + cookID + "'";
            
                                    connection.query(deletequery, function(error, result) {
                                        if (error) {
                                            res.status(500).json({
                                                status: "500",
                                                message: "Failed to execute query"
                                                });
                                        }
                                        else {
                                            res.status(200).json({
                                                status: "200",
                                                message: "Removed!",
                                                result: result
                                            });
                                        }
                                    });
                                }
                            }
                        })
                    } 
                }
            });
        });
    },
}