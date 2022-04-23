var express = require('express');
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

/* GET users listing. */
router.get('/', function(req, res, next) {
  var exampleArray = ["item", "item2"];
  var exampleObject = {
      item: "Bread",
      item2: "Butter"
  }
  var json = JSON.stringify({
      object: exampleObject,
      array: exampleArray,
      tekst: "JSON!! JSON!!"
  });
  res.end(json);
});

router.get('/user', function(req, res, next) {
  var exampleArray = ["user", "user2"];
  var exampleObject = {
      item: "Userbread",
      item2: "Userbutter"
  }
  var json = JSON.stringify({
      object: exampleObject,
      array: exampleArray,
      tekst: "JSON!! JSON!!"
  });
  res.end(json);
});

router.get('/users', function(req, res, next) {
  let sql = 'Select * From SelectAll';
  let data = {};

  db.all(sql, function(err, rows){
    if (err) {
      throw(err);
    }
    rows.forEach(function(row){
      data[row.id] = {};
      Object.keys(row).forEach(function(k){
        data[row.id][k] = unescape(row[k]);
      });
    });
    res.end(data);
  });
});

router.get('/users?id', function(req, res, next) {
  let sql = 'Select * From SelectAll';

  res.end(json);
});

module.exports = router;
