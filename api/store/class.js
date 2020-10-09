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


/* --- Function allows teacher to create a class --- */
function addClass(req, res) {
    return new Promise(resolve => {
        
        try{
            req.checkBody('name', 'Name field is required.').notEmpty();
            req.checkBody('description', 'Description field is required.').notEmpty();
            req.checkBody('instructor_id', 'instructor_id field is required.').notEmpty();
            
            if (req.validationErrors()) {
                resolve();
                return;
            }
        } catch (error) {

        }
        
        let name = req.body.name;
        let description = req.body.description;
        let instructor_id = req.body.instructor_id;

        let con = mysql.createConnection(dbInfo);
        con.query(`insert into class (name, description, instructor_id) values (${mysql.escape(name)}, ${mysql.escape(description)}, ${mysql.escape(instructor_id)})`, (error, results, fields) => {
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

/* --- Gets list of classes (maybe for recommendation for teacher when creating classes?)--- */
function classList(req, res) {
    return new Promise(resolve => {
        let con = mysql.createConnection(dbInfo);      // select * from `class` where instructor_id in (select id from `user` where school = (SELECT school FROM `user` WHERE username = 'afsjbaf') and type = 1)
        con.query('select name, description from class', (error, results, fields) => {
            if (error) {
                console.log(error.stack);
                con.end();
                resolve();
                return;
            }
            console.log(results);
            con.end();
            resolve(results);
        });
    });
}

/* --- Adds a student to a class --- */
/* --- Updates class's student list and user's class list --- */
function addStudentToClass(req, res) {
    return new Promise(resolve => {
        try{
            req.checkBody('email', 'studentId field is required.').notEmpty();
            if ( isNull(req.query.classId) ) {
                console.log("NO CLASS ID SPECIFIED");
                return;
            } 
            if (req.validationErrors()) {
                console.log("Validation error");
                resolve();
                return;
            }
        } catch (error) {
            //console.log("ERROR in checkbody");
            resolve();
            return;
        }
        let email = req.body.email;
        let classId = req.query.classId;

        let con = mysql.createConnection(dbInfo);
        con.query(`select student_list from class where id = ${mysql.escape(classId)}`, (error, results, fields) => {
            if (error) {
                console.log(error.stack);
                con.end();
                //res.status(400).json({status:400, message: "Query error finding student_list from class."});
                resolve();
                return;
            }
            
            if ( results[0] === undefined ) {
                resolve();
                return;
            }
            if ( isNull(results[0].student_list) ) {
                results[0].student_list = `[ "${mysql.escape(email)}" ]`;
            }

            var listStud = JSON.parse(results[0].email);
            
            if ( listStud.includes(email.toString()) ) {
                console.log("ALREADY CONTAINS IT");
                con.end();
                
                //res.status(400).json({status:400, message: "Student already enrolled in class."});
                resolve();
                return;
            } else {
                listStud.push(email.toString());
                console.log("UPDATED LIST: "+listStud);
            }

            con.query(`update class set student_list = ${mysql.escape(JSON.stringify(listStud))} where id = ${mysql.escape(classId)}`, async (error2, results2, fields2) => {
                    if (error2) {
                        console.log(error2.stack);
                        con.end();
                        //res.status(400).json({status:400, message: "Update to class failed."});
                        resolve();
                        return;
                    }

                    await addClassToStudent(studentId, classId, req, res);
                    
                    console.log("Results1: " + results + "\nResults2: " + results2);
                    console.log(`${req.body.email} successfully added.`);
                    con.end();
                    //req.flash('success', 'Successfully created class.');
                    //res.send(results2);
                    resolve( results2);
                    return;
            });

        });
    });
}

// router.post('/addStudentToClass', function(req, res, next) {
// });

//incorporate this in previous call
function addClassToStudent(studentId, classId, req, res) {
    return new Promise(resolve => {
        let con = mysql.createConnection(dbInfo);
        con.query(`select class_list from user where id = ${mysql.escape(studentId)}`, (error, results, fields) => {
            if (error) {
                console.log(error.stack);
                con.end();
                //res.status(400).json({status:400, message: "Error getting class_list from user."});
                resolve();
                return;
            }
            
            console.log(results);
            if ( isNull(results[0].class_list) ) {
                results[0].class_list = `[ "${mysql.escape(studentId)}" ]`;
            }

            var listStud = JSON.parse(results[0].class_list);

            if (listStud.includes(classId.toString()) ) {
                console.log("USER LIST ALREADY CONTAINS IT");
            } else {
                listStud.push(classId.toString());
                console.log("UPDATED LIST: "+listStud);
            }

            con.query(`update user set class_list = ${mysql.escape(JSON.stringify(listStud))} where id = ${mysql.escape(studentId)}`, (error2, results2, fields2) => {
                    if (error2) {
                        console.log(error2.stack);
                        con.end();
                        //res.status(400).json({status:400, message: "Update to user failed."});
                        resolve();
                        return;
                    }

                    console.log("Results3 ");
                    console.log(results);
                    console.log("\nResults4: ");
                    console.log(results2);
                    console.log(`${req.body.classId} successfully added.`);
                    con.end();
                    resolve();
            });

        });
    });
}

function getInstructorClasses(req, res) {
    return new Promise(resolve => {
        console.log("IN INSTRUCTOR CLASSES: "+req);
        try{
            
            if ( isNull(req.query.user_id) ) {
                console.log("NO USER ID SPECIFIED");
                resolve();
                return;
            } 
        } catch (error) {
            console.log("ERROR");
        }

        let con = mysql.createConnection(dbInfo);
        con.query(`select * from class where instructor_id = ${mysql.escape(req.query.user_id)}`, (error, results, fields) => {
            if (error) {
                console.log(error.stack);
                con.end();
                //res.status(400).json({status:400, message: "Error getting class_list from user."});
                //resolve();
                return;
            }
                   
            if ( results[0] === undefined ) {
                 //res.status(400).json({status:400, message: "Error user_id not found or instructor has no classes."});
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

function getStudentClasses(req, res) {
    return new Promise(resolve => {
        //console.log("IN getstudetnclasses: "+req.body);
        try{
            if ( isNull(req.query.user_id) ) {
                console.log("NO USER ID SPECIFIED");
                resolve();
                return;
            } 
        } catch (error) {
            console.log("ERROR");
        }

        let con = mysql.createConnection(dbInfo);
        con.query(`select class_list from user where id = ${mysql.escape(req.query.user_id)}`, (error, results, fields) => {
            if (error) {
                console.log(error.stack);
                con.end();
                //res.status(400).json({status:400, message: "Error getting class_list from user."});
                //resolve();
                return;
            }
                   
            if ( results[0] === undefined ) {
                 //res.status(400).json({status:400, message: "Error user_id not found."});
                 con.end();
                 resolve();
                 return;
            }
            
            if( results[0].class_list == "" ) {
                 //res.status(400).json({status:400, message: "Error user_id not enrolled in no classes."});
                 con.end();
                 resolve();
                 return;
            }

            var listStud = results[0].class_list;
            listStud = listStud.toString().substring(1, listStud.length-1);
            listStud = "("+listStud+")";
            console.log("LIST " + listStud);
            
            con.query(`select * from class where id in ${listStud}`, (error2, results2, fields2) => {
                    if (error2) {
                        console.log(error2.stack);
                        con.end();
                        res.status(400).json({status:400, message: "Update to user failed."});
                        return;
                    }

                    console.log("\nResults2: ");
                    console.log(results2);
                    console.log(`${req.query.user_id} successfully added.`);
                    con.end();
                    resolve(results2);
            });

        });
    });

    
}

function addStudentRequest(req, res) {
    return new Promise(resolve => {
        console.log("Fuck");
        try{
            if ( isNull(req.query.classId) ) {
                console.log("NO CLASS ID SPECIFIED");
                resolve();
                return;
            } 
        } catch (error) {
            console.log("ERROR");
        }

        let con = mysql.createConnection(dbInfo);
        con.query(`select id, request_list from class where id = ${req.query.classId}`, async (error, results, fields) => {
            console.log("results");
            if (error) {
                console.log(error.stack);
                con.end();
                res.status(400).json({status:400, message: "Update to request list failed."});
                resolve();
                return;
            } 
            if (results.length === 1){
                console.log(results, req.user.email, results[0].request_list)
                let requestlist = results[0].request_list;
                if (requestlist == null) {
                    requestlist = {};
                    console.log("POGG")
                } else {
                    requestlist = JSON.parse(requestlist);
                }
                requestlist[req.user.email] = req.user.name;
                console.log(requestlist)
                let reqlist = JSON.stringify(requestlist);
                con.query(`update class set request_list = ${mysql.escape(reqlist)} where id = ${req.query.classId}`, (error1, results1, fields1) => {
                    if (error1) {
                        console.log(error1.stack);
                        con.end();
                        res.status(400).json({status:400, message: "Update to request list failed."});
                        resolve();
                        return;
                    } 
                    console.log("hit2")
                    con.end();
                    resolve("Worked");
                    return;
                });
            } else {
                con.end();
                res.status(400).json({status:400, message: "Class does not exist."});
                resolve();
                return;
            }

            // con.end();
            // resolve(results);
            // return;
        });
    });
}

async function getStudentRequests(req, res) {
    return new Promise(resolve => {
        try{
            if ( isNull(req.query.classId) ) {
                console.log("NO CLASS ID SPECIFIED");
                resolve();
                return;
            } 
        } catch (error) {
            console.log("ERROR");
        }

        let con = mysql.createConnection(dbInfo);
        con.query(`select id, request_list from class where id = ${req.query.classId}`, (error, results, fields) => { 
            if (error) {
                console.log(error.stack);
                con.end();
                res.status(400).json({status:400, message: "Update to request list failed."});
                resolve();
                return;
            } 
            if (results.length === 1){
                con.end();
                let requestlist = results[0].request_list;
                if (requestlist == null) {
                    requestlist = {};
                } else {
                    requestlist = JSON.parse(requestlist);
                }
                resolve(requestlist);
                return;
            } else {
                con.end();
                res.status(400).json({status:400, message: "Class does not exist."});
                resolve();
                return;
            }

            con.end();
            resolve(results);
            return;
        });
    });
}

module.exports = {addStudentToClass, classList, addClass, getStudentClasses, getInstructorClasses, addStudentRequest, getStudentRequests}