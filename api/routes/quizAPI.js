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
    let quizId = req.body.quizId;
    let con = mysql.createConnection(dbInfo);
    con.query(`SELECT * FROM quizzes WHERE quizId = ${mysql.escape(quizId)};`, (error, results, fields) => {
        if (error) {
            console.log(error.stack);
        }
            con.end();
        res.send(results[0]);
        return;
});


});


router.post('/newQuizQuestionCreation', AuthenticationFunctions.ensureAuthenticated, async function(req,res,next){
    let quizId = req.body.quizId;
    let instructorId = req.body.instructorId;
    let classId = req.body.classId;
    let newQuestion = req.body.newQuestion;
    let newQuestionCorrectAnswer = req.body.newQuestionCorrectAnswer;
    let newQuestionPointValue = req.body.newQuestionPointValue;
    let newQuestionAnswerA = req.body.newQuestionAnswerA;
    let newQuestionAnswerB = req.body.newQuestionAnswerB;
    let newQuestionAnswerC = req.body.newQuestionAnswerC;
    let newQuestionAnswerD = req.body.newQuestionAnswerD;

    let answerChoicesList = [];
    answerChoicesList.push({A: newQuestionAnswerA});
    answerChoicesList.push({B: newQuestionAnswerB});
    answerChoicesList.push({C: newQuestionAnswerC});
    answerChoicesList.push({D: newQuestionAnswerD});

    let answerChoicesJSON = JSON.stringify(answerChoicesList);
    console.log(answerChoicesJSON);

    let con = mysql.createConnection(dbInfo);
    con.query(`INSERT INTO quizQuestionTable (quizId,quizQuestion,quizQuestionAnswer,answerChoices,pointValue) VALUES(${mysql.escape(quizId)},${mysql.escape(newQuestion)},${mysql.escape(newQuestionCorrectAnswer)},${mysql.escape(answerChoicesJSON)},${mysql.escape(newQuestionPointValue)});`, (error, results, fields) => {
        if (error) {
          console.log(error.stack);
        }
        con.end();
        res.send("\"OK\"");
        return;
    });


});


router.post('/getAllQuizQuestions', AuthenticationFunctions.ensureAuthenticated, async function(req,res,next){
    let quizId = req.body.quizId;
    let con = mysql.createConnection(dbInfo);
    con.query(`SELECT * FROM quizQuestionTable WHERE quizId = ${mysql.escape(quizId)};`, (error, results, fields) => {
        if (error) {
            console.log(error.stack);
        }
            con.end();
        res.send(results);
        return;
});

});



module.exports = router;