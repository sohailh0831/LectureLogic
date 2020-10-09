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
  


 const resetEmail = (req, res) => {
    // let username = req.body.username;
    let email = req.body.newEmail;
    let userId = req.user.id;
    let newEmail = req.body.reNewEmail;
    if(email === newEmail){
        let con = mysql.createConnection(dbInfo);
        con.query(`SELECT user WHERE email=${mysql.escape(newEmail)}};`, (error, results, fields) =>  {
            if (error) {
                console.log(error.stack);
                con.end();
                return;
            }
            else{
                if (results.length === 0){
                    con.query(`UPDATE user SET email = ${mysql.escape(newEmail)} WHERE id=${mysql.escape(userId)}};`, (error, results1, fields) =>  {
                        if (error) {
                            console.log(error.stack);
                            con.end();
                            return;
                        }
                        else{
                            con.end();
                            return results1;
                        }
                    });
                }
            }
        });
    }
    return;
}

module.exports = {resetEmail}