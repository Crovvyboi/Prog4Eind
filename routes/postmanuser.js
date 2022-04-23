const { useColors } = require('debug/src/browser');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/user', function(req, res, next) {
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

module.exports = router;