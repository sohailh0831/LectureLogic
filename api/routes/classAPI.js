var express = require("express");
const { isNull } = require("lodash");
var router = express.Router();
const dotenv = require('dotenv').config();
const mysql = require("mysql");
const { addStudentToClass } = require("../store/class");
const { classList } = require("../store/class");
const { addClass, getStudentClasses, getInstructorClasses, postClassQuestion, getClassQuestions, answerClassQuestion, postComment, getComments } = require("../store/class");
const { officialSchools, instructorSchools } = require("../store/school");
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

/* --- TEST: correct input, one of missing required things/params --- */

/* --- Function allows teacher to create a class --- */
router.post('/addClass', AuthenticationFunctions.ensureAuthenticated,async function(req, res, next) {
    let results = await addClass(req, res);
    
    if (results) {
        req.flash('success', 'Successfully added class.');
        console.log("IN results");
        return res.json({status:200, message: "success"});
    } else {
        req.flash('error', 'Failed to add class.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//son({status:400, message: "error"});
    }
});

/* --- Gets list of classes (maybe for recommendation for teacher when creating classes?)--- */
router.get('/classList', async function(req, res, next) {
    let results = await classList(req, res);
    
    if (results) {
        req.flash('success', 'Successfully got class list.');
        console.log("IN results");
        return res.status(200).send(results);
    } else {
        req.flash('error', 'Failed to get class list.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//json({status:400, message: "error"});
    }
});

/* --- getting schools instructors have registered for --- */
/* --- to be used to populate school list for student reg- */
router.get('/instructorSchools', AuthenticationFunctions.ensureAuthenticated,async function(req, res, next) {
    let results = await instructorSchools(req, res);

    if (results) {
        req.flash('success', 'Successfully got instructor school list.');
        console.log("IN results");
        return res.status(200).send(results);
    } else {
        req.flash('error', 'Failed to get instructor school list.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//json({status:400, message: "error"});
    }
});

/* --- official school list --- */
router.get('/officialSchools', async function(req, res, next) {
    
    let results = await officialSchools(req, res);

    if (results) {
        req.flash('success', 'Successfully got official school list.');
        console.log("IN results");
        return res.status(200).send(results);
    } else {
        req.flash('error', 'Failed to get official school list.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//json({status:400, message: "error"});
    }
});

/* --- Adds a student to a class --- */
/* --- Updates class's student list and user's class list --- */
router.post('/addStudentToClass', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    let results = await addStudentToClass(req, res);

    if (results) {
        req.flash('success', 'Successfully added student to class.');
        console.log("IN RESULTS");
        return res.status(200).json({status:200, message: "success"});
    } else {
        req.flash('error', 'Something went wrong. Try again.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//json({status:400, message: "error"});
    }
});

router.get('/studentClasses', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    let results = await getStudentClasses(req, res);

    if (results) {
        req.flash('success', 'Successfully got student classes.');
        console.log("IN RESULTS");
        return res.status(200).send(results);
    } else {
        req.flash('error', 'Something went wrong. Try again.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//json({status:400, message: "error"});
    }
});

router.get('/instructorClasses', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    console.log("USERID: "+req.query.user_id);
    let results = await getInstructorClasses(req, res);

    if (results) {
        req.flash('success', 'Successfully got instructor classes.');
        console.log("IN RESULTS");
        return res.status(200).send(results);
    } else {
        req.flash('error', 'Something went wrong. Try again.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//.json({status:400, message: "error"});
    }
});

router.post('/postClassQuestion', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    console.log("USERID: "+req.query.user_id);
    let results = await postClassQuestion(req, res);

    if (results) {
        req.flash('success', 'Successfully got inserted class question classes.');
        console.log("IN RESULTS");
        return res.json({status:200, message: "success"});
    } else {
        req.flash('error', 'Something went wrong. Try again.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//.json({status:400, message: "error"});
    }
});

router.get('/getClassQuestions', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    let results = await getClassQuestions(req, res);

    if (results) {
        req.flash('success', 'Successfully got class questions.');
        console.log("IN RESULTS");
        return res.status(200).send(results);
    } else {
        req.flash('error', 'Something went wrong. Try again.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//.json({status:400, message: "error"});
    }
});

router.post('/answerQuestion', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    let results = await answerClassQuestion(req, res);
    
    if (results) {
        req.flash('success', 'Successfully answered question.');
        console.log("IN results");
        return res.json({status:200, message: "success"});
    } else {
        req.flash('error', 'Failed to answer question.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//son({status:400, message: "error"});
    }
});

router.get('/getComments', async function(req, res, next) {
    console.log("questionID: "+req.query.questionId);
    let results = await getComments(req, res);
    
    if (results) {
        req.flash('success', 'Successfully got class list.');
        console.log("IN results");
        console.log(results);
        return res.status(200).send(results);
    } else {
        req.flash('error', 'Failed to get class list.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//json({status:400, message: "error"});
    }
});

router.post('/postComment', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    let results = await postComment(req, res);
    
    if (results) {
        req.flash('success', 'Successfully posted Comment.');
        console.log("IN results");
        return res.json({status:200, message: "success"});
    } else {
        req.flash('error', 'Failed to post comment.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//son({status:400, message: "error"});
    }
});

module.exports = router;