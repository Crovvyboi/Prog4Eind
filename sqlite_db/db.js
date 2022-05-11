// const { response } = require('../app');

// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('./sqlite_db/prog4eind_sqlitedb.db');

// module.exports = db;

// online db
const mysql = require('mysql');
require('dotenv').config();
const pool = mysql.createPool({

    connectionLimit : 10,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

module.exports = pool;

// pool.getConnection(function (err, connection) {
//     if (err) throw error;

//     connection.query('Select name, id From meal', function (error, results, fields) {
//         connection.release();

//         if (error) throw error;

//         console.log('results = ' + results);

//         pool.end((err) => {
//             console.log('pool was closed.');
//         });
//     });
// });


pool.on('acquire', function (connection) {
    console.log('connection %d acquired', connection.threadID);
});

pool.on('release', function (connection) {
    console.log('connection %d released', connection.threadID);
});