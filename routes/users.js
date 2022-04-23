var express = require('express');
const { json } = require('express/lib/response');
var router = express.Router();

// Connect to db
var db = require('../sqlite_db/db');

var schema = {
  "User":[
    "ID",
    "Firstname",
    "Insertion",
    "Lastname",
    "Street",
    "Email",
    "Phonenumber",
    "Password",
    "Role"
  ]
}

/* GET user listing. */
router.get('/users', function(req, res, next) {
  let sql = 'Select * From SelectAll';

  db.all(sql, function(err, data) {
    if (err) {
      debug.log(err);
    }
    else{
      var json = JSON.stringify({
        data
      })
      res.status(202).json(json);
    }
  })
});

router.post('/users/post', function(req, res, next) {
  let sql = "Insert Into User (ID, Firstname, Lastname, Street, City, isActive, Email, Password, Phonenumber)" +
  "Values(?,?,?,?,?,?,?,?,?)";

  db.run(sql, [req.body.ID, req.body.firstname, req.body.lastname, req.body.street, req.body.city, req.body.isActive, req.body.email, req.body.password, req.body.phonenumber], function(err) {
    if (err) {
      debug.log(err);
    }
    else{
      res.status(201).json({
        status: "201",
        message: "Inserted!"
      });
    }
  })
});

router.get('/users/id', function(req, res, next) {
  let sql = 'Select * From SelectAll';

  res.end(json);
});

module.exports = router;
