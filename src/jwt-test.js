const jwt = require('jsonwebtoken')

const privateKey = 'secretstring'

jwt.sign({ userid: 4 }, privateKey,  function(err, token) {
    if (err) {
        console.log(err)
    }
    if (token) {
        console.log(token);
    }

  });