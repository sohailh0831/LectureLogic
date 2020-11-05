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
            
            if ( isNull(req.query.class_id) ) {
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

function removeLecture(req, res) {
    return new Promise(resolve => {
        try{
            if ( isNull(req.body.lecture_id) ) {
                console.log("NO CLASS ID SPECIFIED");
                resolve();
                return;
            } 
        } catch (error) {
            console.log("NO lec id in body");
        }
        
        let lecture_id = req.body.lecture_id;
        // TODO: future - remove data from that lec
        console.log("LECUTER ID: "+req.body.lecture_id);
        let con = mysql.createConnection(dbInfo);
        con.query(`delete from lecture WHERE id = ${mysql.escape(lecture_id)}`, (error, results, fields) => {
            if (error) {
                console.log(error.stack);
                con.end();
                resolve();
                return;
            }
            
            console.log(`${req.body.lecture_id} successfully deleted.`);
            con.end();
            resolve(results);
        });
    });
}

function editLecture(req, res) {
    return new Promise(resolve => {
        
        try{
            req.checkBody('name', 'Name field is required.').notEmpty();
            req.checkBody('description', 'Description field is required.').notEmpty();
            req.checkBody('lecture_id', 'instructor_id field is required.').notEmpty();
            req.checkBody('video_link', 'Video Link field is required.' ).notEmpty();
            req.checkBody('section', 'Section field is required.' ).notEmpty();

            if (req.validationErrors()) {
                resolve();
                return;
            }
        } catch (error) {

        }
        
        let lecture_id = req.body.lecture_id;
        let name = req.body.name;
        let description = req.body.description;
        let video_link = req.body.video_link;
        let section = req.body.section;

        let con = mysql.createConnection(dbInfo);
        con.query(`update lecture SET name=${mysql.escape(name)}, description=${mysql.escape(description)}, section=${mysql.escape(section)}, video_link=${mysql.escape(video_link)} where id=${mysql.escape(lecture_id)}`, (error, results, fields) => {
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

function answerQuestion(req, res) {
    return new Promise(resolve => {
        
        try{
            req.checkBody('questionId', 'questionId field is required.').notEmpty();
            req.checkBody('answer', 'Answer field is required.').notEmpty();

            if (req.validationErrors()) {
                resolve();
                return;
            }
        } catch (error) {

        }
        
        let questionId = req.body.questionId;
        let answer = req.body.answer;
        
        let con = mysql.createConnection(dbInfo);
        con.query(`update question SET answer= ${mysql.escape(answer)}, isAnswered=1 where questionId=${mysql.escape(questionId)}`, (error, results, fields) => {
            if (error) {
                console.log(error.stack);
                con.end();
                resolve();
                return;
            }
            
            console.log(`${req.body.questionId} successfully answered.`);
            con.end();
            resolve(results);
        });
    });
}




module.exports = {getLectures, addLecture, removeLecture, editLecture, answerQuestion}