var express = require('express');
const { json } = require('express/lib/response');
const assert = require('assert');

// Connect to db
var db = require('../sqlite_db/db');
require('dotenv').config();

module.exports = {
    /* GET user listing. */
    getUsers: (req, res, next) => {

        let {id, isActive} = req.query;

        let sql = 'Select * From user';

        // Check if there are inserted parameters (id / isActive)
        if (id || isActive) {
            sql += ' Where '
            if (id) {
               sql += `id = ?` 
            }
            if (id && isActive) {
                sql += ' And '
            }
            if (isActive) {
                sql += `isActive = ?`
            }
        }


        db.getConnection(function (err, connection) {
            if (err) res.status(500).json({
            statusCode: "500",
            message: "Connection error"
            });
            connection.query(sql, [id, isActive], function (error, results, fields) {
            connection.release();

            if (error){
                res.status(400).json({
                statusCode: "400",
                message: "Could not get users"
                })
            } 

            console.log('#results = ' + results.length);
            console.log(process.env.TOKEN_HEADER)
            res.status(200).json({
                statusCode: "200",
                results: results
            });
            });
        });
    },
  
    addUser: (req, res, next) => {
        let sql = "Insert Into user (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) " + " Values(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let checkusersql = "Count(*) From user Where emailAdress = '?'"
    
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
    
        // Insert email RegEx
        let regEx =  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if (!regEx.test(req.body.email)) {
            res.status(400).json({
                statusCode: "400",
                message: "Email does not meet requirements"
            });
        }
        else{
                
            db.getConnection(function (err, connection) {
                if (err) res.status(500).json({
                    statusCode: "500",
                    message: "Connection error"
                });

                connection.query(checkusersql, [req.body.email], function(error, results, fields) {
                    if (results > 0) {
                    res.status(409).json({
                        statusCode: "409",
                        message: "User already exists",
                    });
                    }

                    connection.query(sql, [req.body.firstname, req.body.lastname, req.body.isActive, req.body.email, req.body.password, req.body.phonenumber, req.body.roles, req.body.street, req.body.city], function(err, results) {
                    if (err) {
                        res.status(409).json({
                        statusCode: "409",
                        message: "Failed to insert!"
                        });
                    }
                
                    res.status(201).json({
                        statusCode: "201",
                        message: "Inserted!",
                        result: results
                    });
                    });
                });
            });
        }
    },
    
    // Use token to get profile
    getUserProfile: (req, res, next) => {
        db.getConnection(function (err, connection) {
        if (err) res.status(500).json({
            statusCode: "500",
            message: "Connection error"
        });
    
        connection.query("Select * From user Where emailAdress = ?", req.body.email, function(err, data) {
            if (err) {
            console.log(err);
            res.status(400).json({
                statusCode: "400",
                message: "Could not get user"
            })
            }
    
            console.log("Functie nog niet gerealiseerd");
            res.status(200).json({
            statusCode: "200",
            results: data});
    
        });
        });
    },

    
    updateUser: (req, res, next) => {
        let sql = "Update user Set firstName = ?, lastName = ?, street = ?, city = ?, isActive = ?, phoneNumber = ? " +
        "Where emailAdress = ? And password = ?";
    
        // Check phonenumber regex
        let phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
        if (!phoneRegex.test(req.body.phonenumber)) {
            res.status(400).json({
                statusCode: "400",
                message: "Phonenumber does not meet standard expression"
            });
        }
        else {
            db.getConnection(function (err, connection) {
                if (err) res.status(500).json({
                    statusCode: "500",
                    message: "Connection error"
                });
            
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
            });
        }
    },
    
    deleteUser: (req, res, next) => {
        let sql = "Delete From user " +
        "Where emailAdress = ? And password = ?";
    
        db.getConnection(function (err, connection) {
        if (err) res.status(500).json({
            statusCode: "500",
            message: "Connection error"
        });
    
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
                });
            }
    

            });
        });
    }
}
