// const { response } = require('../app');

// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('./sqlite_db/prog4eind_sqlitedb.db');

// module.exports = db;

// online db
const mysql = require('mysql');
require('dotenv').config();
const dbConfig = {
    connectionLimit : 10,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
}

const pool = mysql.createPool(dbConfig);


pool.on('acquire', function (connection) {
    console.log(`connection acquired`, connection.threadID);
});

pool.on('release', function (connection) {
    console.log(`connection released`, connection.threadID);
});

module.exports = pool;