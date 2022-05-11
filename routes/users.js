var express = require('express');
const { json } = require('express/lib/response');
var router = express.Router();
module.exports = router;

// Connect to db
var db = require('../sqlite_db/db');

/* GET user listing. */
router.get('/users', function(req, res, next) {
  let sql = 'Select * From user';

  db.getConnection(function (err, connection) {
      if (err) throw error;

      connection.query(sql, function (error, results, fields) {
        connection.release();

        if (error){
          res.status(500).json({
            statusCode: "500",
            message: "Could not get users"
          })
          throw error;
        } 

        console.log('#results = ' + results.length);
        res.status(202).json({
          statusCode: "202",
          results: results
        });
      });
  });
});


router.post('/users/post', function(req, res, next) {
  let sql = "Insert Into user (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) " + " Values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.getConnection(function (err, connection) {
    if (err) throw error;
    
    connection.query(sql, [req.body.firstname, req.body.lastname, req.body.isActive, req.body.email, req.body.password, req.body.phonenumber, req.body.roles, req.body.street, req.body.city], function(err) {
      if (err) {
        res.status(500).json({
          statusCode: "500",
          message: "Failed to insert!"
        });
        throw err
      }

      res.status(201).json({
        statusCode: "201",
        message: "Inserted!"
      });
    });
  });
});

router.get('/users/profile', function(req, res, next) {
  db.getConnection(function (err, connection) {
    if (err) throw error;

    connection.query("Select * From user Where emailAdress = ?", req.body.email, function(err, data) {
      if (err) {
        console.log(err);
        res.status(500).json({
          statusCode: "500",
          message: "Could not get user"
        })
        throw err;
      }

      console.log("Functie nog niet gerealiseerd");
      res.status(202).json({
        statusCode: "202",
        results: data});

    });
  });
});

router.get('/users/id', function(req, res, next) {

  db.getConnection(function (err, connection) {
    if (err) throw error;

    connection.query("Select * From user Where id = ?", req.body.id, function(err, data) {
      if (err) {
        console.log(err);
        res.status(500).json({
          statusCode: "500",
          message: "Failed to get user!"
        });
        throw err;
      }

      res.status(202).json({
        statusCode: "202",
        results: data
      });
      
    });
  });
});

router.put('/users/update', function(req, res, next) {
  let sql = "Update user Set firstName = ?, lastName = ?, street = ?, city = ?, isActive = ?, phoneNumber = ? " +
  "Where emailAdress = ? And password = ?";

  db.getConnection(function (err, connection) {
    if (err) throw error;

    connection.query(sql, [req.body.firstname, req.body.lastname, req.body.street, req.body.city, req.body.isActive, req.body.phonenumber, req.body.email, req.body.password], function(err) {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "500",
          message: "Failed to update!"
        });
      }

      res.status(205).json({
        status: "205",
        message: "Updated!"
      });
    });
  });
});

router.delete('/users/remove', function(req, res, next) {
  let sql = "Delete From user " +
  "Where emailAdress = ? And password = ?";

  db.getConnection(function (err, connection) {
    if (err) throw error;

    connection.query(sql, [req.body.email, req.body.password], function(err) {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "500",
          message: "Failed to delete!"
        });
        throw err;
      }

        res.status(206).json({
          status: "206",
          message: "Removed!"
        });
      });
  });
});

module.exports = router;
