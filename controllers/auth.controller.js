const jwt = require('jsonwebtoken')
const db = require('../sqlite_db/db');
const assert = require('assert')

module.exports = {
    login: (req, res, next) => {
        const {emailAdress, password} = req.body;

        const queryString = "Select id, firstName, lastName, emailAdress, password From user Where emailAdress = ?";

        db.getConnection(function (err, connection) {
            if (err) res.status(500).json({
              statusCode: "500",
              message: "Connection error"
            });
        
            connection.query(queryString, [emailAdress], function(err, results) {
              if (err) {
                console.log(err);
                res.status(404).json({
                  statusCode: "404",
                  message: "Failed to get user!"
                });
                throw err;
              }

              if (results && results.length === 1) {
                console.log(results[0])

                const user = results[0];

                if (user.password === password) {

                    jwt.sign({ userid: user.id }, 'process.env.JWT_SECRET', {expiresIn: '7d'},  function(err, token) {
                        if (err) {
                            console.log(err)
                        }
                        if (token) {
                            console.log(token);
                            res.status(200).json({
                            statusCode: "200",
                            results: token
                            });
                        }
                    
                    });
                }
                else {

                }

              }
              else {
                res.status(404).json({
                    statusCode: "404",
                    message: "No results found"
                });
              }

        
            //   res.status(200).json({
            //     statusCode: "200",
            //     results: results
            //   });
              
            });
        });
    }
}