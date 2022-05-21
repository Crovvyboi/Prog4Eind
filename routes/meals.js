var express = require('express');
const { json } = require('express/lib/response');
var router = express.Router();
module.exports = router;

// Connect to db
var db = require('../sqlite_db/db');
require('dotenv').config();

/* GET meal listing. */
router.post('/meals/post', function(req, res, next) {
    let sql = "Insert Into meal () " + " Values()";
  
    db.getConnection(function (err, connection) {
      if (err) res.status(500).json({
        statusCode: "500",
        message: "Connection error"
      });
      
      connection.query(sql, [], function(err) {
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
});

router.put('/meals/update', function(req, res, next) {
let sql = "Update meal Set " +
"Where emailAdress = ? And password = ?";

db.getConnection(function (err, connection) {
    if (err) res.status(500).json({
    statusCode: "500",
    message: "Connection error"
    });

    connection.query(sql, [], function(err) {
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
});

router.get('/meals', function(req, res, next) {
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
});

router.delete('/meals/remove', function(req, res, next) {
    let sql = "Delete From meal " +
    "Where ";

    db.getConnection(function (err, connection) {
        if (err) res.status(500).json({
        statusCode: "500",
        message: "Connection error"
        });

        connection.query(sql, [], function(err) {
        if (err) {
            console.log(err);
            res.status(400).json({
            status: "500",
            message: "Failed to delete!"
            });
            throw err;
        }

            res.status(200).json({
            status: "200",
            // Show removed data
            message: "Removed!"
            });
        });
    });
});

module.exports = router;