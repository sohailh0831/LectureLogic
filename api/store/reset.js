var express = require('express');
const flash = require('connect-flash');
const uuid = require('uuid');
const mysql = require("mysql");

export const resetEmail = (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let newEmail = '';
    con.query(`UPDATE user SET email = ${mysql.escape(newEmail)} WHERE email = ${mysql.escape(email)}, username = ${mysql.escape(username)};`, (error, results, fields) =>  {
        if (error) {
            console.log(error.stack);
            con.end();
            return;
        }
        if (results) {
            console.log(`${req.body.newEmail} successfully registered.`);
            con.end();
            req.flash('success', 'Successfully updated.');
            return res.redirect('/login');
        }
        else {
            con.end();
            req.flash('error', 'Something Went Wrong. Try Again.');
            return res.redirect('/register');
        }
    });
}