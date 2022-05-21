var express = require('express');
const { json } = require('express/lib/response');
var router = express.Router();


// Connect to db
var db = require('../sqlite_db/db');
require('dotenv').config();

/* GET user listing. */
router.get('/users', function(req, res, next) {
  let sql = 'Select * From user';

  // Check if there are inserted parameters (id / name)

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

router.post('/users/post', function(req, res, next) {
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
  if (false) {
    res.status(400).json({
      statusCode: "400",
      message: "Email does not meet requirements"
    });
  }

  // Insert password RegEx
  if (false) {
    res.status(400).json({
      statusCode: "400",
      message: "Password does not meet requirements"
    });
  }

  // Check if user exists

  db.getConnection(function (err, connection) {
    if (err) res.status(500).json({
      statusCode: "500",
      message: "Connection error"
    });

    connection.query(checkusersql, [req.body.email], function(error, results, fields) {
      // Check if user does not exist
      if (results > 0) {
        res.status(409).json({
          statusCode: "409",
          message: "User already exists",
        });
      }

      connection.query(sql, [req.body.firstname, req.body.lastname, req.body.isActive, req.body.email, req.body.password, req.body.phonenumber, req.body.roles, req.body.street, req.body.city], function(err) {
        if (err) {
          res.status(409).json({
            statusCode: "409",
            message: "Failed to insert!"
          });
          throw err
        }
  
        res.status(201).json({
          statusCode: "201",
          message: "Inserted!",
          // show inserted user
          result: ""
        });
      });
    });
  });
});

router.get('/users/profile', function(req, res, next) {
  // check JWT token
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
        throw err;
      }

      console.log("Functie nog niet gerealiseerd");
      res.status(200).json({
        statusCode: "200",
        results: data});

    });
  });
});

router.get('/users/id', function(req, res, next) {
  // Check jwt token
  db.getConnection(function (err, connection) {
    if (err) res.status(500).json({
      statusCode: "500",
      message: "Connection error"
    });

    connection.query("Select * From user Where id = ?", req.body.id, function(err, data) {
      if (err) {
        console.log(err);
        res.status(404).json({
          statusCode: "404",
          message: "Failed to get user!"
        });
        throw err;
      }

      res.status(200).json({
        statusCode: "200",
        results: data
      });
      
    });
  });
});

router.put('/users/update', function(req, res, next) {
  let sql = "Update user Set firstName = ?, lastName = ?, street = ?, city = ?, isActive = ?, phoneNumber = ? " +
  "Where emailAdress = ? And password = ?";

  // Check phonenumber regex
  if (false) {
    res.status(400).json({
      statusCode: "400",
      message: "Phonenumber does not meet standard expression"
    });
  }

  db.getConnection(function (err, connection) {
    if (err) res.status(500).json({
      statusCode: "500",
      message: "Connection error"
    });

    connection.query(sql, [req.body.firstname, req.body.lastname, req.body.street, req.body.city, req.body.isActive, req.body.phonenumber, req.body.email, req.body.password], function(err) {
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

router.delete('/users/remove', function(req, res, next) {
  let sql = "Delete From user " +
  "Where emailAdress = ? And password = ?";

  // check if user is owner

  db.getConnection(function (err, connection) {
    if (err) res.status(500).json({
      statusCode: "500",
      message: "Connection error"
    });

    connection.query(sql, [req.body.email, req.body.password], function(err) {
      if (err) {
        console.log(err);
        res.status(400).json({
          status: "400",
          message: "Failed to delete!"
        });
        throw err;
      }

        res.status(200).json({
          status: "200",
          message: "Removed!"
        });
      });
  });
});



module.exports = router;
