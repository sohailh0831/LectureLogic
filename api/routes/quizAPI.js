var express = require("express");
const { isNull } = require("lodash");
var router = express.Router();
const dotenv = require('dotenv').config();
const mysql = require("mysql");
const uuid = require('uuid');
 const { getStudentsQuizzes, getStudentGrades, getClassGrades, getStudentAverageClassGrade, updateGrade, updateHideFlag } = require("../store/quiz");

const AuthenticationFunctions = require('../Authentication.js');

let dbInfo = {
    connectionLimit: 100,
    host: '134.122.115.102',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306,
    multipleStatements: true
};

router.get('/getStudentQuizzes', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    console.log("GETTING STUDENT QUIZZWES\n");
    let results = await getStudentsQuizzes(req, res);

    if (results) {
        req.flash('success', 'Successfully got students quizzes.');
        console.log("IN RESULTS");
        return res.status(200).send(results);
    } else {
        req.flash('error', 'Something went wrong. Try again.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//.json({status:400, message: "error"});
    }
});

router.get('/getStudentQuizResults', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    console.log("GETTING STUDENT QUIZZWES\n");
    let results = await getStudentGrades(req, res);

    if (results) {
        req.flash('success', 'Successfully got students quizzes.');
        console.log("IN RESULTS");
        return res.status(200).send(results);
    } else {
        req.flash('error', 'Something went wrong. Try again.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//.json({status:400, message: "error"});
    }
});

router.get('/getClassGrades', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    //console.log("GETTING STUDENT QUIZZWES\n");
    let results = await getClassGrades(req, res);

    if (results) {
        req.flash('success', 'Successfully got class grades.');
        console.log("IN RESULTS");
        return res.status(200).send(results);
    } else {
        req.flash('error', 'Something went wrong. Try again.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//.json({status:400, message: "error"});
    }
});

router.get('/getStudentAverageClassGrade', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    //console.log("GETTING STUDENT QUIZZWES\n");
    let results = await getStudentAverageClassGrade(req, res);

    if (results) {
        req.flash('success', 'Successfully got average class grades.');
        console.log("IN RESULTS");
        return res.status(200).send(results);
    } else {
        req.flash('error', 'Something went wrong. Try again.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//.json({status:400, message: "error"});
    }
});

router.post('/updateGrade', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    //console.log("GETTING STUDENT QUIZZWES\n");
    let results = await updateGrade(req, res);

    if (results) {
        req.flash('success', 'Successfully updated grade.');
        console.log("IN RESULTS");
        return res.status(200).send(results);
    } else {
        req.flash('error', 'Something went wrong. Try again.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//.json({status:400, message: "error"});
    }
});

router.post('/updateHideFlag', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    //console.log("GETTING STUDENT QUIZZWES\n");
    let results = await updateHideFlag(req, res);

    if (results) {
        req.flash('success', 'Successfully updated hide flag.');
        console.log("IN RESULTS");
        return res.status(200).send(results);
    } else {
        req.flash('error', 'Something went wrong. Try again.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//.json({status:400, message: "error"});
    }
});

router.post('/newQuizCreation', AuthenticationFunctions.ensureAuthenticated, async function(req,res,next){
        //let quizId = uuid.v4();
        let instructorId = req.body.instructorId;
        let classId = req.body.classId;
        let quizName  = req.body.quizName;
        let startDate = "2020-11-30 19:31:41";//need to format to date time
        let dueDate = "2020-12-15 19:31:41"; //need to format to datetime
        let showAnswers = req.body.showAnswers;
        let hiddenFlag = 0;

        let con = mysql.createConnection(dbInfo);
        con.query(`INSERT INTO quizzes (instructorId,classId,quizName,startDate,dueDate,showAnswers,hiddenFlag) VALUES(${mysql.escape(instructorId)},${mysql.escape(classId)},${mysql.escape(quizName)},${mysql.escape(startDate)},${mysql.escape(dueDate)},${mysql.escape(showAnswers)},${mysql.escape(hiddenFlag)});`, (error, results, fields) => {
         if (error) {
           console.log(error.stack);
         }
         con.end();
         res.send("\"OK\"");
         return;
     });

    });

     router.post('/getAllQuizzes', AuthenticationFunctions.ensureAuthenticated, async function(req,res,next){
        let classId = req.body.classId;

        let con = mysql.createConnection(dbInfo);
        con.query(`SELECT * FROM quizzes WHERE classId = ${mysql.escape(classId)};`, (error, results, fields) => {
            if (error) {
                console.log(error.stack);
            }
                con.end();
            res.send(results);
            return;
    });
   

});


router.post('/getQuizDetails', AuthenticationFunctions.ensureAuthenticated, async function(req,res,next){
    console.log("HEREHREH");
    let quizId = req.body.quizId;
    console.log(quizId);
    let con = mysql.createConnection(dbInfo);
    con.query(`SELECT * FROM quizzes WHERE quizId = ${mysql.escape(quizId)};`, (error, results, fields) => {
        if (error) {
            console.log(error.stack);
        }
            con.end();
        console.log(results[0]);
        res.send(results[0]);
        return;
});


});


module.exports = router;