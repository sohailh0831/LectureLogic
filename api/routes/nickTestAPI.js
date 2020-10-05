var express = require("express");
const { isNull } = require("lodash");
var router = express.Router();
const dotenv = require('dotenv').config();
const mysql = require("mysql");
const { addStudentToClass } = require("../store/class");

let dbInfo = {
    connectionLimit: 100,
    host: '134.122.115.102',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306,
    multipleStatements: true
  };

  import {
    addStudentToClass,
  } from '../store/class';
/* --- TEST: correct input, one of missing required things/params --- */

/* --- Function allows teacher to create a class --- */
router.post('/addClass', function(req, res, next) {
    let name = req.body.name;
    let description = req.body.description;
    let instructor_id = req.body.instructor_id;
    //let student_list = req.body.student_list;
    
    req.checkBody('name', 'Name field is required.').notEmpty();
    req.checkBody('description', 'Description field is required.').notEmpty();
    req.checkBody('instructor_id', 'instructor_id field is required.').notEmpty();
   
    let con = mysql.createConnection(dbInfo);
    con.query(`insert into class (name, description, instructor_id) values (${mysql.escape(name)}, ${mysql.escape(description)}, ${mysql.escape(instructor_id)})`, (error, results, fields) => {
        if (error) {
            console.log(error.stack);
            con.end();
            res.status(400).send(error);
            return;
        }
        
        console.log(`${req.body.name} successfully created.`);
        con.end();
        req.flash('success', 'Successfully created class.');
        res.send(results);
        
    });

});

/* --- Gets list of classes (maybe for recommendation for teacher when creating classes?)--- */
router.get('/classList', function(req, res, next) {
    let con = mysql.createConnection(dbInfo);      // select * from `class` where instructor_id in (select id from `user` where school = (SELECT school FROM `user` WHERE username = 'afsjbaf') and type = 1)
    con.query('select name, description from class', (error, results, fields) => {
        if (error) {
            console.log(error.stack);
            con.end();
            res.status(400).send(error);
            return;
        }
        console.log(results);
        con.end();
        res.send(results);
    });
});

/* --- getting schools instructors have registered for --- */
/* --- to be used to populate school list for student reg- */
router.get('/instructorSchools', function(req, res, next) {
    let con = mysql.createConnection(dbInfo);
    con.query('select school from user where type = 0', (error, results, fields) => {
        if (error) {
            console.log(error.stack);
            con.end();
            res.status(400).send(error);
            return;
        }
        console.log(results);
        con.end();
        res.send(results);
    });
});

/* --- official school list --- */
router.get('/officialSchools', function(req, res, next) {
    let con = mysql.createConnection(dbInfo);
    con.query('select LocationName from official_schools', (error, results, fields) => {
        if (error) {
            console.log(error.stack);
            con.end();
            res.status(400).send(error);
            return;
        }
        console.log(results);
        con.end();
        res.send(results);
    });
});

router.post('/addStudentToClass', function(req, res, next) {
    return addStudentToClass(req, res);
});


/* --- Adds a student to a class --- */
/* --- Updates class's student list and user's class list --- */
// router.post('/addStudentToClass', function(req, res, next) {
//     let studentId = req.body.studentId;
//     let classId = req.body.classId;

//     req.checkBody('studentId', 'studentId field is required.').notEmpty();
//     req.checkBody('classId', 'classId field is required.').notEmpty();

//     let con = mysql.createConnection(dbInfo);
//     con.query(`select student_list from class where id = ${mysql.escape(classId)}`, (error, results, fields) => {
//         if (error) {
//             console.log(error.stack);
//             con.end();
//             res.status(400).send(error);
//             return;
//         }
        

//         if ( isNull(results[0].student_list) ) {
//             results[0].student_list = `[ "${mysql.escape(studentId)}" ]`;
//         }

//         var listStud = JSON.parse(results[0].student_list);
        
//         if ( listStud.includes(studentId.toString()) ) {
//             console.log("ALREADY CONTAINS IT");
//         } else {
//             listStud.push(studentId.toString());
//             console.log("UPDATED LIST: "+listStud);
//         }

//         con.query(`update class set student_list = ${mysql.escape(JSON.stringify(listStud))} where id = ${mysql.escape(classId)}`, (error2, results2, fields2) => {
//                 if (error2) {
//                     console.log(error2.stack);
//                     con.end();
//                     res.status(400).send(error);
//                     return;
//                 }

//                 addClassToStudent(studentId, classId, req, res, next);

//                 console.log("Results1: " + results + "\nResults2: " + results2);
//                 console.log(`${req.body.studentId} successfully added.`);
//                 con.end();
//                 req.flash('success', 'Successfully created class.');
//                 res.send(results2);
                
//         });

//     });
    

// });

//incorporate this in previous call
// function addClassToStudent(studentId, classId, req, res, next) {
//     let con = mysql.createConnection(dbInfo);
//     con.query(`select class_list from user where id = ${mysql.escape(studentId)}`, (error, results, fields) => {
//         if (error) {
//             console.log(error.stack);
//             con.end();
//             res.status(400).send(error);
//             return;
//         }
        
//         console.log(results);
//         if ( isNull(results[0].class_list) ) {
//             results[0].class_list = `[ "${mysql.escape(studentId)}" ]`;
//         }

//         var listStud = JSON.parse(results[0].class_list);

//         if (listStud.includes(classId.toString()) ) {
//             console.log("USER LIST ALREADY CONTAINS IT");
//         } else {
//             listStud.push(classId.toString());
//             console.log("UPDATED LIST: "+listStud);
//         }

//         con.query(`update user set class_list = ${mysql.escape(JSON.stringify(listStud))} where id = ${mysql.escape(studentId)}`, (error2, results2, fields2) => {
//                 if (error2) {
//                     console.log(error2.stack);
//                     con.end();
//                     res.status(400).send(error);
//                     return;
//                 }

//                 console.log("Results3 ");
//                 console.log(results);
//                 console.log("\nResults4: ");
//                 console.log(results2);
//                 console.log(`${req.body.classId} successfully added.`);
//                 con.end();
//         });

//     });

// }

module.exports = router;