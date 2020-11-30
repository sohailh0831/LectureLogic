var express = require("express");
const { isNull } = require("lodash");
var router = express.Router();
const dotenv = require('dotenv').config();
const mysql = require("mysql");
 const { getStudentsQuizzes, getClassGrades, getStudentAverageClassGrade, updateGrade, updateHideFlag } = require("../store/quiz");

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

router.get('/getStudentQuizResults', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
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
module.exports = router;