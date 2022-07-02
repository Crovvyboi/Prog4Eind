var express = require('express');
const { json } = require('express/lib/response');
const assert = require('assert');
const jwt = require('jsonwebtoken');

// Connect to db
var db = require('../sqlite_db/db');
require('dotenv').config();

module.exports = {
    addMeal: (req, res, next) => {
        let sql = "Insert Into meal ( isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookId, createDate, updateDate, name, description, allergenes) " + 
        " Values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";


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
                            console.log('token is valid', payload)

                            connection.query(sql, [req.body.isActive, req.body.isVega, req.body.isVegan, req.body.isToTakeHome, req.body.dateTime, req.body.maxAmountOfParticipants, req.body.price, req.body.imageUrl, payload.id, req.body.createDate, req.body.updateDate, req.body.name, req.body.description, req.body.allergenes], function(err, result) {
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
    },

    updateMeal: (req, res, next) => {
        // Check if user owns meal through meal_participants_user
        let sql = "Update meal Set isActive = ?,  isVega = ?, isVegan = ?, isToTakeHome = ?, dateTime = ? " +
        ", maxAmountOfParticipants = ?, price = ?, imageUrl = ?, cookId = ?, createDate = ?" +
        ", updateDate = ?, name = ?, description = ?, allergenes = ?" +
        "Where name = ? and cookId = ?";
        
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
                            console.log('token is valid', payload)

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
                    })
                }

            }
        

        });
    },

    getMeals: (req, res, next) => {
        let sql = 'Select * From meal';
    
        // Check for inserted parameters (isactive / name)
      
        db.getConnection(function (err, connection) {
            if (err) res.status(500).json({
              statusCode: "500",
              message: "Connection error"
            });
            connection.query(sql, function (error, results, fields) {
              connection.release();
      
              if (error){
                res.status(400).json({
                  statusCode: "400",
                  message: "Could not get users"
                })
              } 
      
              console.log('#results = ' + results.length);
              res.status(200).json({
                statusCode: "200",
                results: results
              });
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
                                console.log('token is valid', payload)

                                // Compare cookID to userid in sessiontoken
                                let checkusersql = "Select * from meal Where cookId = " + payload.id + " and id = " + mealid
                
                                connection.query(checkusersql, function(err) {
                                    if (err) {
                                        res.status(500).json({
                                            status: "500",
                                            message: "Failed to execute checkuser query"
                                        })
                                    }                
                                    else if (results.length < 1) {
                                        res.status(403).json({
                                        status: "403",
                                        message: "User does not own meal!"
                                        });
                                    }
                                    else {
                                        let deletequery = "Delete From meal Where id = " + mealid + " and cookId = " + payload.id;
                
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

                                });
                            }
                        })
                    }

                    
                }
            });
        });
    }
}