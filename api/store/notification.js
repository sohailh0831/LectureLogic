var express = require('express');
const flash = require('connect-flash');
const uuid = require('uuid');
const { isNull, result } = require("lodash");
const mysql = require("mysql");
const dotenv = require('dotenv').config();
var expressValidator = require('express-validator');
var app = express();
app.use(expressValidator());
var app = express.Router();

let dbInfo = {
    connectionLimit: 100,
    host: '134.122.115.102',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306,
    multipleStatements: true
};

function postMessage(req, res) {
    return new Promise(resolve => {
        console.log(req.user, req.query)
        try{
            // req.checkBody('quizId', 'quizId field is required.').notEmpty();
        } catch (error) {
            console.log("ERROR");
        }
    
        let con = mysql.createConnection(dbInfo);
        con.query(`insert into message (sender, receiver, content, type, status, class) VALUES (${req.body.sender}, ${req.body.receiver}, ${req.body.content}, ${req.body.type}, ${true}, ${req.body.class})`, async (error, results, fields1) => { 
            if (error) {
                console.log(error.stack);
                con.end();
                res.status(400).json({status:400, message: "Insert to message table failed."});
                resolve();
                return;
            } 
            if (results){
                con.end();
                resolve("OK");
                return;
            } else {
                con.end();
                res.status(400).json({status:400, message: "Class does not exist."});
                resolve();
                return;
            }
        });
    });
    }

function getMessages(req, res) {
    return new Promise(resolve => {
        console.log(req.user, req.query)
        try{
            // req.checkBody('quizId', 'quizId field is required.').notEmpty();
        } catch (error) {
            console.log("ERROR");
        }
    
        let con = mysql.createConnection(dbInfo);
        con.query(`select content, sender, time from message WHERE receiver = '${req.user.id}' ORDER BY id DESC`, async (error, results, fields1) => { 
            if (error) {
                console.log(error.stack);
                con.end();
                res.status(400).json({status:400, message: "Insert to message table failed."});
                resolve();
                return;
            } 
            if (results){
                con.end();
                resolve(results);
                return;
            } else {
                con.end();
                res.status(400).json({status:400, message: "Class does not exist."});
                resolve();
                return;
            }
        });
    });
    }

function getNotifications(req, res) {
return new Promise(resolve => {
    console.log(req.user, req.query)
    try{
        // req.checkBody('quizId', 'quizId field is required.').notEmpty();
    } catch (error) {
        console.log("ERROR");
    }

    let con = mysql.createConnection(dbInfo);
    con.query(`select content, sender, time from message WHERE receiver = '${req.user.id}' AND status = 1 ORDER BY id DESC`, async (error, results, fields1) => { 
        if (error) {
            console.log(error.stack);
            con.end();
            res.status(400).json({status:400, message: "Insert to message table failed."});
            resolve();
            return;
        } 
        if (results){
            con.end();
            resolve(results);
            return;
        } else {
            con.end();
            res.status(400).json({status:400, message: "Class does not exist."});
            resolve();
            return;
        }
    });
});
}
function getNotificationsByClass(req, res) {
return new Promise(resolve => {
    console.log(req.user, req.query)
    try{
        // req.checkBody('quizId', 'quizId field is required.').notEmpty();
    } catch (error) {
        console.log("ERROR");
    }

    let con = mysql.createConnection(dbInfo);
    con.query(`select content, sender, time from message WHERE receiver = '${req.user.id}' AND status = 1 AND class = '${req.query.class}' ORDER BY id DESC`, async (error, results, fields1) => { 
        if (error) {
            console.log(error.stack);
            con.end();
            res.status(400).json({status:400, message: "Insert to message table failed."});
            resolve();
            return;
        } 
        if (results){
            con.end();
            resolve(results);
            return;
        } else {
            con.end();
            res.status(400).json({status:400, message: "Class does not exist."});
            resolve();
            return;
        }
    });
});
}
function getMessagesByClass(req, res) {
return new Promise(resolve => {
    console.log(req.user, req.query)
    try{
        // req.checkBody('quizId', 'quizId field is required.').notEmpty();
    } catch (error) {
        console.log("ERROR");
    }

    let con = mysql.createConnection(dbInfo);
    con.query(`select content, sender, time from message WHERE receiver = '${req.user.id}' AND class = '${req.query.class}' ORDER BY id DESC`, async (error, results, fields1) => { 
        if (error) {
            console.log(error.stack);
            con.end();
            res.status(400).json({status:400, message: "Insert to message table failed."});
            resolve();
            return;
        } 
        if (results){
            con.end();
            resolve(results);
            return;
        } else {
            con.end();
            res.status(400).json({status:400, message: "Class does not exist."});
            resolve();
            return;
        }
    });
});
}

function clearNotifications(req, res) {
    return new Promise(resolve => {
        console.log(req.user, req.query)
        try{
            // req.checkBody('quizId', 'quizId field is required.').notEmpty();
        } catch (error) {
            console.log("ERROR");
        }
    
        let con = mysql.createConnection(dbInfo);
        con.query(`update quiz SET status = 0 WHERE receiver = '${req.user.id}' AND sataus = 1 ORDER BY id DESC`, async (error, results, fields1) => { 
            if (error) {
                console.log(error.stack);
                con.end();
                res.status(400).json({status:400, message: "Insert to message table failed."});
                resolve();
                return;
            } 
            con.end();
            res.status(200)
            resolve();
            return;
        });
    });
    }

function clearNotificationsByClass(req, res) {
    return new Promise(resolve => {
        console.log(req.user, req.query)
        try{
            // req.checkBody('quizId', 'quizId field is required.').notEmpty();
        } catch (error) {
            console.log("ERROR");
        }
    
        let con = mysql.createConnection(dbInfo);
        con.query(`update message SET status = 0 WHERE receiver = '${req.user.id}' AND class = '${req.query.class}' AND sataus = 1 ORDER BY id DESC`, async (error, results, fields1) => { 
            if (error) {
                console.log(error.stack);
                con.end();
                res.status(400).json({status:400, message: "Insert to message table failed."});
                resolve();
                return;
            } 
            
            con.end();
            res.status(200)
            resolve();
            return;
        });
    });
    }
        





module.exports = {postMessage, getMessages, getNotifications, getMessagesByClass, getNotificationsByClass, clearNotifications, clearNotificationsByClass}