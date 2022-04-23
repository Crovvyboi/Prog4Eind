const { response } = require('../app');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./sqlite_db/prog4eind_sqlitedb.db');

// Get users from shareameal api
const response = fetch('https://shareameal-api.herokuapp.com/api/user', {
    method: 'GET',
    headers:{
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
}).then(response => response.json()).then(data => console.log(data));

var userobj = JSON.parse(response.json());
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