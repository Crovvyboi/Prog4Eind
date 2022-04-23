const { response } = require('../app');
// const bodyparser = require("body-parser");

// app.use(bodyparser.json());

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./sqlite_db/prog4eind_sqlitedb.db');

// const data = {};

// // Get users from shareameal api
// data = async url => {
//     const response = await fetch("https://shareameal-api.herokuapp.com/api/user");
//     if (!response.ok) {
//         throw new Error(response.statusText);
//     }
//     var data = response.json();
//     console.log(data);
//     return data;
// }

// var userobj = JSON.parse(data);
// for (let index = 0; index < userobj[index] ; index++) {
//     var query = "Insert Into User (ID, Firstname, Lastname, Street, City, isActive, Email, Password, Phonenumber)" +
//     "Values("
//     + userobj[index].id +
//     + userobj[index].firstName +
//     + userobj[index].lastName +
//     + userobj[index].street +
//     + userobj[index].city +
//     + userobj[index].isActive +
//     + userobj[index].emailAdress +
//     + userobj[index].password +
//     + userobj[index].phoneNumber +
//     ")";

//     db.run(query)
// }

module.exports = db;