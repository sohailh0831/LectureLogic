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

function updateConfidence(req, res) {
    return new Promise(resolve => {
        try{
            req.checkBody('quizId', 'quizId field is required.').notEmpty();
            req.checkBody('val', 'val field is required.').notEmpty();
            req.checkBody('question', 'question field is required.').notEmpty();
        } catch (error) {
            console.log("ERROR");
        }

        let con = mysql.createConnection(dbInfo);
        con.query(`select confidence from quiz where uuid = ${req.user.uuid}, quizId = ${req.body.quizId}`, (error, results, fields) => { 
            if (error) {
                console.log(error.stack);
                con.end();
                res.status(400).json({status:400, message: "Update to request list failed."});
                resolve();
                return;
            } 
            if (results.length === 1) {
                let confidence = JSON.parse(results[0]).confidence;
                confidence[req.body.question] = req.body.val;
                con.query(`update quiz set confidence where uuid = ${req.user.uuid}, quizId = ${req.body.quizId}`, async (error1, results1, fields1) => { 
                    if (error1) {
                        console.log(error1.stack);
                        con.end();
                        res.status(400).json({status:400, message: "Update to request list failed."});
                        resolve();
                        return;
                    } 
                    if (results1.length === 1){
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
                return;
            }
            con.end();
            resolve(results);
            return;
        });
    });
}


module.exports = {updateConfidence}