var express = require('express');
const { json } = require('express/lib/response');
const assert = require('assert');

// Connect to db
var db = require('../sqlite_db/db');
require('dotenv').config();

module.exports = {
    addMeal: (req, res, next) => {
        let sql = "Insert Into meal ( isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookId, createDate, updateDate, name, description, allergenes) " + " Values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        db.getConnection(function (err, connection) {
            if (err) res.status(500).json({
            statusCode: "500",
            message: "Connection error"
            });
            
            connection.query(sql, [req.body.isActive, req.body.isVega, req.body.isVegan, req.body.isToTakeHome, req.body.dateTime, req.body.maxAmountOfParticipants, req.body.price, req.body.imageUrl, req.body.cookId, req.body.createDate, req.body.updateDate, req.body.name, req.body.description, req.body.allergenes], function(err) {
            if (err) {
                res.status(409).json({
                statusCode: "409",
                message: "Failed to insert!"
                });
                throw err
            }
        
            res.status(201).json({
                statusCode: "201",
                // show inserted data
                message: "Inserted!"
            });
            });
        });
    },

    updateMeal: (req, res, next) => {
        // Check if user owns meal through meal_participants_user
        let sql = "Update meal Set isActive = ?,  isVega = ?, isVegan = ?, isToTakeHome = ?, dateTime = ? " +
        ", maxAmountOfParticipants = ?, price = ?, imageUrl = ?, cookId = ?, createDate = ?" +
        ", updateDate = ?, name = ?, description = ?, allergenes = ?" +
        "Where name = ? And id = ?";
        
        db.getConnection(function (err, connection) {
            if (err) res.status(500).json({
            statusCode: "500",
            message: "Connection error"
            });
        
            connection.query(sql, [req.body.isActive, req.body.isVega, req.body.isVegan, req.body.isToTakeHome, req.body.dateTime, req.body.maxAmountOfParticipants, req.body.price, req.body.imageUrl, req.body.cookId, req.body.createDate, req.body.updateDate, req.body.name, req.body.description, req.body.allergenes, req.body.name, req.body.id], function(err) {
            if (err) {
                console.log(err);
                res.status(400).json({
                status: "400",
                message: "Failed to update!"
                });
            }
        
            res.status(200).json({
                status: "200",
                // Show updated data
                message: "Updated!"
            });
            });
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
        let getMealquery = "Select * From meal Where id = mealId";

        let deletequery = "Delete From meal Where id = ?";
    
        db.getConnection(function (err, connection) {
            if (err) res.status(500).json({
            statusCode: "500",
            message: "Connection error"
            });
    
            connection.query(getMealquery, [req.body.mealId], function(err, results) {
                if (err) {
                    res.status(500).json({
                        status: "500",
                        message: "Failed to execute query"
                    })
                }
                if (results < 1) {
                    res.status(404).json({
                    status: "404",
                    message: "Meal does not exist!"
                    });
                    throw err;
                }

                let checkusersql = "Select mealId from meal_participants_user Where mealId = ? and userId = ?"

                connection.query(checkusersql, [req.body.mealId, req.body.userId], function(err) {
                    if (err) {
                        res.status(500).json({
                            status: "500",
                            message: "Failed to execute query"
                        })
                    }

                    if (results < 1) {
                        res.status(403).json({
                        status: "403",
                        message: "User does not own meal!"
                        });
                        throw err;
                    }


                    connection.query(deletequery, [req.body.mealId], function(err, result) {
                        if (err) {
                            res.status(500).json({
                                status: "500",
                                message: "Failed to execute query"
                                });
                        }

                        res.status(200).json({
                        status: "200",
                        message: "Removed!",
                        result: result
                        });
                    });


                });
            });
        });
    }
}