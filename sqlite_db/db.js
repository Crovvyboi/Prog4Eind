const { response } = require('../app');
// const fetch = require("node-fetch");

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./sqlite_db/prog4eind_sqlitedb.db');

// Get users from shareameal api
const getjson = async url => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = response.json();
    return data;
}

var userobj = JSON.parse(data);
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