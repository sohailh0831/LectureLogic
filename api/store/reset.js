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
    return new Promise(resolve => {
        let email = req.body.newEmail;
        let userId = req.user.id;
        let newEmail = req.body.reNewEmail;
        if(email === newEmail){
            let con = mysql.createConnection(dbInfo);
            con.query(`SELECT id from user WHERE email=${mysql.escape(newEmail)};`, (error, results, fields) =>  {
                if (error) {
                    console.log(error.stack);
                    con.end();
                    resolve();
                    return;
                }
                else{
                    if (results.length === 0){
                        con.query(`UPDATE user SET email = ${mysql.escape(newEmail)} WHERE id=${mysql.escape(userId)};`, (error1, results1, fields1) =>  {
                            if (error1) {
                                console.log(error1.stack);
                                con.end();
                                resolve();
                                return;
                            }
                            else{
                                con.end();
                                resolve("OK");
                                return;
                            }
                        });
                    }
                }
            });
        }
        else {
            resolve();
            return;
        }
    });
}

module.exports = {resetEmail}