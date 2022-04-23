var express = require('express');
var router = express.Router();

var db = require('./sqlite_db/db.js');


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

router.get('/user', function(req, res, next) {
  let sql = 'Select * From SelectAll';
  res.end(json);
});

module.exports = router;
