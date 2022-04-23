var express = require('express');
const { json } = require('express/lib/response');
var router = express.Router();

// Connect to db
var db = require('../sqlite_db/db');

/* GET user listing. */
router.get('/users', function(req, res, next) {
  let sql = 'Select * From User';

  db.all(sql, function(err, data) {
    if (err) {
      console.log(err);
    }
    else{
      res.status(202).json(data);
    }
  });
});

router.post('/users/post', function(req, res, next) {
  let sql = "Insert Into User (ID, Firstname, Lastname, Street, City, isActive, Email, Password, Phonenumber) " + " Values(?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.run(sql, [req.body.id, req.body.firstname, req.body.lastname, req.body.street, req.body.city, req.body.isActive, req.body.email, req.body.password, req.body.phonenumber], function(err) {
    if (err) {
      console.log(err);
      res.status(500).json({
        status: "500",
        message: "Failed to insert!"
      });
    }
    else{
      res.status(201).json({
        status: "201",
        message: "Inserted!"
      });
    }
  });
});

router.get('/users/profile', function(req, res, next) {
  db.get("Select * From User Where Email = ?", req.body.email, function(err, data) {
    if (err) {
      console.log(err);
      
    }
    else{
      console.log("Functie nog niet gerealiseerd");
      res.status(202).json(data);
    }
  });
});

router.get('/users/id', function(req, res, next) {

  db.get("Select * From User Where ID = ?", req.body.id, function(err, data) {
    if (err) {
      console.log(err);
      res.status(500).json({
        status: "500",
        message: "Failed to get user!"
      });
    }
    else{
      if (data = "") {
        res.status(202).json({message : "no data found"});
      }
      res.status(202).json(data);
    }
  });
});

router.put('/users/update', function(req, res, next) {
  let sql = "Update User Set Firstname = ?, Lastname = ?, Street = ?, City = ?, isActive = ?, Email = ?, Phonenumber = ? " +
  "Where ID = ? And Password = ?";

  db.run(sql, [req.body.firstname, req.body.lastname, req.body.street, req.body.city, req.body.isActive, req.body.email, req.body.phonenumber, req.body.id, req.body.password], function(err) {
    if (err) {
      console.log(err);
      res.status(500).json({
        status: "500",
        message: "Failed to update!"
      });
    }
    else{
      res.status(205).json({
        status: "205",
        message: "Updated!"
      });
    }
  });
});

router.delete('/users/remove', function(req, res, next) {
  let sql = "Delete From User " +
  "Where ID = ? And Password = ?";

  db.run(sql, [req.body.id, req.body.password], function(err) {
    if (err) {
      console.log(err);
      res.status(500).json({
        status: "500",
        message: "Failed to delete!"
      });
    }
    else{
      res.status(206).json({
        status: "206",
        message: "Removed!"
      });
    }
  });
});

module.exports = router;
