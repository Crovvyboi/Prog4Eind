const { response } = require('../app');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./sqlite_db/prog4eind_sqlitedb.db');

// Get users from shareameal api
function Get(url){
    var http = new XMLHttpRequest();
    http.open("GET", url,false );
    http.send(null);
    return http.responseText;
}

var userobj = JSON.parse(Get('https://shareameal-api.herokuapp.com/api/user'));
for (let index = 0; index < userobj[index] ; index++) {
    var query = "Insert Into User (ID, Firstname, Lastname, Street, City, isActive, Email, Password, Phonenumber)" +
    "Values("
    + userobj[index].id +
    + userobj[index].firstName +
    + userobj[index].lastName +
    + userobj[index].street +
    + userobj[index].city +
    + userobj[index].isActive +
    + userobj[index].emailAdress +
    + userobj[index].password +
    + userobj[index].phoneNumber +
    ")";

    db.run(query)
}

module.exports = db;