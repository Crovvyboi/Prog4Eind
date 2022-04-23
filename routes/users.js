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
router.get('/user', function(req, res, next) {
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
      res.status(202).end(json);
    }
  })
});

router.get('/users?id', function(req, res, next) {
  let sql = 'Select * From SelectAll';

  res.end(json);
});

module.exports = router;
