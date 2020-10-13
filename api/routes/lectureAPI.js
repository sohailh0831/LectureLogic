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



module.exports = router;