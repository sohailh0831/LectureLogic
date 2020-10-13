var express = require('express');
const flash = require('connect-flash');
const uuid = require('uuid');
const { isNull, result } = require("lodash");
const mysql = require("mysql");
const dotenv = require('dotenv').config();
var expressValidator = require('express-validator');
const { json } = require('express');
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

/* --- Gets list of lectures for a class --- */
function getLectures(req, res) {
    return new Promise(resolve => {
        console.log("IN INSTRUCTOR CLASSES: "+req);
        try{
            
            if ( isNull(req.query.clas_id) ) {
                console.log("NO CLASS ID SPECIFIED");
                resolve();
                return;
            } 
        } catch (error) {
            console.log("ERROR");
        }
        let con = mysql.createConnection(dbInfo);
        con.query(`select * from lecture where class_id = ${mysql.escape(req.query.class_id)}`, (error, results, fields) => {
            if (error) {
                console.log(error.stack);
                con.end();
                
                return;
            }    
            if ( results[0] === undefined ) {   
                 con.end()
                 resolve();
                 return;
            }
            con.end();
            resolve(results);
            return;
        });

    });
}

function addLecture(req, res) {
    return new Promise(resolve => {
        
        try{
            req.checkBody('name', 'Name field is required.').notEmpty();
            req.checkBody('description', 'Description field is required.').notEmpty();
            req.checkBody('class_id', 'instructor_id field is required.').notEmpty();
            req.checkBody('video_link', 'Video Link field is required.' ).notEmpty();
            req.checkBody('section', 'Section field is required.' ).notEmpty();

            if (req.validationErrors()) {
                resolve();
                return;
            }
        } catch (error) {

        }
        
        let name = req.body.name;
        let description = req.body.description;
        let class_id = req.body.class_id;
        let video_link = req.body.video_link;
        let section = req.body.section;

        let con = mysql.createConnection(dbInfo);
        con.query(`insert into lecture (name, description, class_id, section, video_link) values (${mysql.escape(name)}, ${mysql.escape(description)}, ${mysql.escape(class_id)}, ${mysql.escape(section)},${mysql.escape(video_link)})`, (error, results, fields) => {
            if (error) {
                console.log(error.stack);
                con.end();
                resolve();
                return;
            }
            
            console.log(`${req.body.name} successfully created.`);
            con.end();
            resolve(results);
        });
    });
}



module.exports = {getLectures, addLecture}