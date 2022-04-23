const { response } = require('../app');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./sqlite_db/prog4eind_sqlitedb.db');

module.exports = db;