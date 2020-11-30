var express = require("express");
const { isNull } = require("lodash");
var router = express.Router();
const dotenv = require('dotenv').config();
const mysql = require("mysql");
// const { addStudentToClass } = require("../store/class");
// const { classList } = require("../store/class");
// const { addClass, getStudentClasses, getInstructorClasses } = require("../store/class");
// const { officialSchools, instructorSchools } = require("../store/school");
const { getLectures } = require("../store/lecture"); 
const { addLecture } = require("../store/lecture");
const { removeLecture } = require("../store/lecture");
const { editLecture } = require("../store/lecture");
const { answerQuestion } = require("../store/lecture");
const { resolveQuestion, unresolveQuestion, getComments, postComment, setViewedFlag, updateHideFlag } = require("../store/lecture");

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
// router.post('/addClass', AuthenticationFunctions.ensureAuthenticated,async function(req, res, next) {
//     let results = await addClass(req, res);
    
//     if (results) {
//         req.flash('success', 'Successfully added class.');
//         console.log("IN results");
//         return res.json({status:200, message: "success"});
//     } else {
//         req.flash('error', 'Failed to add class.');
//         console.log("IN NO RESULTS");
//         return res.status(400).send(results);//son({status:400, message: "error"});
//     }
// });

/* --- Gets list of lectures --- */
router.get('/lectureList', async function(req, res, next) {
    let results = await getLectures(req, res);
    
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

router.post('/addLecture', AuthenticationFunctions.ensureAuthenticated,async function(req, res, next) {
    let results = await addLecture(req, res);
    
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

router.post('/removeLecture', AuthenticationFunctions.ensureAuthenticated,async function(req, res, next) {
    
    console.log("lec id "+req.body.lecture_id);
    let results = await removeLecture(req, res);
    
    if (results) {
        req.flash('success', 'Successfully removed lecture.');
        console.log("IN results");
        return res.json({status:200, message: "success"});
    } else {
        req.flash('error', 'Failed to remove lecture.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//son({status:400, message: "error"});
    }
});

router.post('/editLecture', AuthenticationFunctions.ensureAuthenticated,async function(req, res, next) {
    
    //console.log("lec id "+req.body.lecture_id);
    let results = await editLecture(req, res);
    
    if (results) {
        req.flash('success', 'Successfully edited lecture.');
        console.log("IN results");
        return res.json({status:200, message: "success"});
    } else {
        req.flash('error', 'Failed to edit lecture.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//son({status:400, message: "error"});
    }
});

router.post('/answerQuestion', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    let results = await answerQuestion(req, res);
    
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

router.post('/resolveQuestion', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    let results = await resolveQuestion(req, res);
    
    if (results) {
        req.flash('success', 'Successfully resovled question.');
        console.log("IN results");
        return res.json({status:200, message: "success"});
    } else {
        req.flash('error', 'Failed to resolve question.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//son({status:400, message: "error"});
    }
});
router.post('/unresolveQuestion', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    let results = await unresolveQuestion(req, res);
    
    if (results) {
        req.flash('success', 'Successfully resovled question.');
        console.log("IN results");
        return res.json({status:200, message: "success"});
    } else {
        req.flash('error', 'Failed to resolve question.');
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

router.post('/setViewedFlag', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
    let results = await setViewedFlag(req, res);
    
    if (results) {
        req.flash('success', 'Successfully setViewedFlag.');
        console.log("IN results");
        return res.json({status:200, message: "success"});
    } else {
        req.flash('error', 'Failed set view flag.');
        console.log("IN NO RESULTS");
        return res.status(400).send(results);//son({status:400, message: "error"});
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