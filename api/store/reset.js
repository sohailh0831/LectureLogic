var express = require('express');
const flash = require('connect-flash');
const uuid = require('uuid');
const mysql = require("mysql");

let dbInfo = {
    connectionLimit: 100,
    host: '134.122.115.102',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306,
    multipleStatements: true
  };
  


export const resetEmail = (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let newEmail = '';
    let con = mysql.createConnection(dbInfo);
    con.query(`UPDATE user SET email = ${mysql.escape(newEmail)} WHERE email = ${mysql.escape(email)}, username = ${mysql.escape(username)};`, (error, results, fields) =>  {
        if (error) {
            console.log(error.stack);
            con.end();
            return;
        }
        else{
            con.end();
            return results;
        }
    });
}