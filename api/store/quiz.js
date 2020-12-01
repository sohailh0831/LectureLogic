var express = require('express');
const flash = require('connect-flash');
const uuid = require('uuid');
const { isNull, result } = require("lodash");
const mysql = require("mysql");
const dotenv = require('dotenv').config();
var expressValidator = require('express-validator');
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

function updateConfidence(req, res) {
    return new Promise(resolve => {
        console.log(req.body)
        try{
            req.checkBody('quizId', 'quizId field is required.').notEmpty();
            req.checkBody('val', 'val field is required.').notEmpty();
            req.checkBody('time', 'time field is required.').notEmpty();

        } catch (error) {
            console.log("ERROR");
        }

        let con = mysql.createConnection(dbInfo);
        con.query(`select confidence, record from quiz WHERE uuid = '${req.user.id}' AND lecId = ${req.body.quizId}`, (error, results, fields) => { 
            console.log('results:', results)
            if (error) {
                console.log(error.stack);
                con.end();
                res.status(400).json({status:400, message: "Update to request list failed."});
                resolve();
                return;
            } 
            if (results.length === 1) {
                console.log('hitting')
                let confidence = JSON.parse(results[0].confidence);
                if (!confidence) confidence = {};
                confidence = req.body.val;
                let conf = JSON.stringify(confidence);

                let record = JSON.parse(results[0].record);
                if (!record) record = {};
                record[req.body.time] = req.body.val;
                let rec = JSON.stringify(record);
                console.log(rec)
                con.query(`update quiz set record = ${mysql.escape(rec)} WHERE uuid = '${req.user.id}' AND lecId = ${req.body.quizId}`, async (error1, results1, fields1) => { 
                    if (error1) {
                        console.log(error1.stack);
                        con.end();
                        res.status(400).json({status:400, message: "Update to request list failed."});
                        resolve();
                        return;
                    } 
                    else if (!results1){
                        con.end();
                        res.status(400).json({status:400, message: "Class does not exist."});
                        resolve();
                        return;
                    }
                });
                
                con.query(`update quiz set confidence = ${mysql.escape(conf)} WHERE uuid = '${req.user.id}' AND lecId = ${req.body.quizId}`, async (error1, results1, fields1) => { 
                    if (error1) {
                        console.log(error1.stack);
                        con.end();
                        res.status(400).json({status:400, message: "Update to request list failed."});
                        resolve();
                        return;
                    } 
                    if (results1){
                        con.end();
                        resolve("OK");
                        return;
                    } else {
                        con.end();
                        res.status(400).json({status:400, message: "Class does not exist."});
                        resolve();
                        return;
                    }
                });
                resolve();
                return;
            }
            con.end();
            resolve(results);
            return;
        });
    });
}



function getConfidence(req, res) {
return new Promise(resolve => {
    console.log(req.user, req.query)
    try{
        // req.checkBody('quizId', 'quizId field is required.').notEmpty();
    } catch (error) {
        console.log("ERROR");
    }

    let con = mysql.createConnection(dbInfo);
    con.query(`select confidence, record from quiz WHERE uuid = '${req.query.id}' AND lecId = ${req.query.quizId}`, (error, results, fields) => { 
        if (error) {
            console.log(error.stack);
            con.end();
            res.status(400).json({status:400, message: "Query to request list failed."});
            resolve();
            return;
        } 
        if (results.length === 1) {
            let confidence = JSON.parse(results[0].confidence);
            if (!confidence) confidence = {};
            
            let record = JSON.parse(results[0].record);
            if (!record) confidence = {};

            console.log({confidence, record})
            resolve({confidence, record});
            return;
        }
        con.end();
        resolve(results);
        return;
    });
});
}


function getAllConfidence(req, res) {
    return new Promise(resolve => {
        console.log(req.user, req.query)
        try{
            // req.checkBody('quizId', 'quizId field is required.').notEmpty();
        } catch (error) {
            console.log("ERROR");
        }
    
        let con = mysql.createConnection(dbInfo);
        con.query(`select confidence, name from quiz LEFT JOIN user ON quiz.uuid = user.id WHERE lecId = ${req.query.quizId}`, (error, results, fields) => { 
            if (error) {
                console.log(error.stack);
                con.end();
                res.status(400).json({status:400, message: "Query to request list failed."});
                resolve();
                return;
            } 
            if (results) {
                var i = 0;
                var confidences = []
                
                for (i; i<results.length; i++){
                    let confidence = JSON.parse(results[i].confidence);
                    if (!confidence) continue;
                    confidences.push({name: results[i].name, confidence: results[i].confidence})
                }
    
                console.log(confidences)
                resolve(confidences);
                return;
            }
            con.end();
            resolve(results);
            return;
        });
    });
    }

function getAvgConfidence(req, res) {
return new Promise(resolve => {
    console.log(req.user, req.body)
    try{
    } catch (error) {
        console.log("ERROR");
    }

    let con = mysql.createConnection(dbInfo);
    con.query(`select confidence from quiz WHERE lecId = ${req.query.quizId}`, (error, results, fields) => { 
        if (error) {
            console.log(error.stack);
            con.end();
            res.status(400).json({status:400, message: "Update to request list failed."});
            resolve();
            return;
        } 
        console.log('POGG',results)
        if (results.length > 0) {
            let sum = 0;
            let i = 0;
            for(i; i < results.length; i++){
                let confidence = JSON.parse(results[i].confidence);
                if (!confidence) confidence = '0';
                else sum += parseInt(confidence, 10);
            }
            let avg = sum/results.length;
            console.log(avg)
            resolve(avg);
            return;
        }
        con.end();
        resolve(results);
        return;
    });
});
}

function setDueDate(req, res) {
    return new Promise(resolve => {
        try{
            //req.checkBody('classId', 'classId field is required.').notEmpty();
            req.checkBody('quizId', 'quizId field is required.').notEmpty();
            req.checkBody('dueDate', 'dueDate field is required.').notEmpty();

            if (req.validationErrors()) {
                resolve();
                return;
            }
        } catch (error) {

        }
        
        //let classId = req.body.classId;
        let quizId = req.body.quizId;
        let dueDate = req.body.dueDate;
        let con = mysql.createConnection(dbInfo);
        con.query(`update quizzes set dueDate = ${mysql.escape(dueDate)} where quizId = ${mysql.escape(quizId)}`, (error, results, fields) => {
            if (error) {
                console.log(error.stack);
                con.end();
                resolve();
                return;
            }
            
            console.log(`successfully updated due date.`);
            con.end();
            resolve(results);
        });
    });
}
//TODO need to get class list and parse
function getStudentsQuizzes(req, res) {
    return new Promise(resolve => {
        try{   
            
            if ( isNull(req.query.studentId) ) {
                console.log("NO STUDENT ID SPECIFIED");
                resolve();
                return;
            } 
        } catch (error) {
            
        }
        
        //get classes
        console.log("studentId: "+req.query.studentId);
        let classList = "";
        let con = mysql.createConnection(dbInfo);
        con.query(`select class_list from user where id = ${mysql.escape(req.query.studentId)}`, (error, results, fields) => { 
            if (error) {
                console.log(error.stack);
                con.end();
                res.status(400).json({status:400, message: "Failed to get classList."});
                resolve();
                return;
            } 

            con.end();
            //resolve(results);
            //return;
            console.log("classList: ");
            console.log(results[0].class_list);
            classList = JSON.stringify(results[0].class_list);
            classList = classList.substring(2, classList.length-2);
            classList = "("+classList+")";
            classList = classList.replace(/"/g, '');
            classList = classList.replace(/\\/g, '');

            console.log("Class list: "+classList);

            let con2 = mysql.createConnection(dbInfo);
            con2.query(`select * from quizzes, quizQuestionTable where classId in `+classList+` order by classId, dueDate ASC`, (error, results2, fields) => { 
                if (error) {
                    console.log(error.stack);
                    con2.end();
                    res.status(400).json({status:400, message: "Failed to get classList."});
                    resolve();
                    return;
                } 

                con2.end();
                resolve(results2);
                return;
    
            });

            //con2.end();
            
        });
        
    });
}

//get student grades
function getStudentGrades(req, res) {
    return new Promise(resolve => {
        try{   
            
            if ( isNull(req.query.studentId) ) {
                console.log("NO studentId ID SPECIFIED");
                resolve();
                return;
            } 
        } catch (error) {
            
        }
        
        //let questionId = req.body.questionId;
        console.log("studentId: "+req.query.studentId);
        let con = mysql.createConnection(dbInfo);
        con.query(`select * from quizGradeStudents where studentId = ${mysql.escape(req.query.studentId)} order by classId, quizId`, (error, results, fields) => { 
            if (error) {
                console.log(error.stack);
                con.end();
                res.status(400).json({status:400, message: "Failed to get classgrades."});
                resolve();
                return;
            } 

            con.end();
            resolve(results);
            return;
  
        });
    });
}

function getClassGrades(req, res) {
    return new Promise(resolve => {
        try{   
            
            if ( isNull(req.query.classId) ) {
                console.log("NO class ID SPECIFIED");
                resolve();
                return;
            } 
        } catch (error) {
            
        }
        
        //let questionId = req.body.questionId;
        console.log("classId: "+req.query.classId);
        let con = mysql.createConnection(dbInfo);
        con.query(`select * from quizGradeStudents where classId = ${mysql.escape(req.query.classId)} order by quizId, studentId`, (error, results, fields) => { 
            if (error) {
                console.log(error.stack);
                con.end();
                res.status(400).json({status:400, message: "Failed to get classgrades."});
                resolve();
                return;
            } 

            con.end();
            resolve(results);
            return;
  
        });
    });
}

function getStudentAverageClassGrade(req, res) {
    return new Promise(resolve => {
        try{   
            
            if ( isNull(req.query.classId) ) {
                console.log("NO class ID SPECIFIED");
                resolve();
                return;
            } 
            if ( isNull(req.query.studentId) ) {
                console.log("NO class ID SPECIFIED");
                resolve();
                return;
            } 
        } catch (error) {
            
        }
        
        //let questionId = req.body.questionId;
        console.log("classId: "+req.query.classId);
        console.log("studentId: "+req.query.studentId);
        let con = mysql.createConnection(dbInfo);
        con.query(`select avg(score) as avgGrade from quizGradeStudents where classId = ${mysql.escape(req.query.classId)} and studentId = ${mysql.escape(req.query.studentId)} group by classId, studentId`, (error, results, fields) => { 
            if (error) {
                console.log(error.stack);
                con.end();
                res.status(400).json({status:400, message: "Failed to get studentsGrades."});
                resolve();
                return;
            } 
            console.log("average grade ");
            console.log(results);
            // let avg = 0;
            // let iter = 0;
            // while( 1 == 1 ){
            //     if(results[iter] === undefined) {
            //         // console.log("UNDEF BREAKING");
            //         break;
            //     }
            //     // console.log("grade: "+results[iter].grade);
            //     avg += results[iter].grade;
            //     iter++;
            // }

            // avg = avg/iter;
            // console.log("avg: "+avg);
            con.end();
            //resolve(JSON.stringify({'average': avg}));
            resolve(results);
            return;
  
        });
    });
}

function updateGrade(req, res) {
    return new Promise(resolve => {
        try{
            req.checkBody('quizId', 'quizId field is required.').notEmpty();
            req.checkBody('grade', 'grade field is required.').notEmpty();
            req.checkBody('studentId', 'studentId is required').notEmpty();

            if (req.validationErrors()) {
                resolve();
                return;
            }
        } catch (error) {

        }
        
        let grade = req.body.grade;
        let quizId = req.body.quizId;
        let studentId = req.body.studentId;
        let con = mysql.createConnection(dbInfo);
        con.query(`update quizGradeStudents set score = ${mysql.escape(grade)} where quizId = ${mysql.escape(quizId)} and studentId = ${mysql.escape(studentId)}`, (error, results, fields) => {
            if (error) {
                console.log(error.stack);
                con.end();
                resolve();
                return;
            }
            
            console.log(`successfully updated quiz grade.`);
            con.end();
            resolve(results);
        });
    });
}

function updateHideFlag(req, res) {
    return new Promise(resolve => {
        try{
            req.checkBody('quizId', 'quizId field is required.').notEmpty();
            req.checkBody('hideFlag', 'hideFlag field is required.').notEmpty();

            if (req.validationErrors()) {
                resolve();
                return;
            }
        } catch (error) {

        }
        
        let quizId = req.body.quizId;
        let hideFlag = req.body.hideFlag;
        let con = mysql.createConnection(dbInfo);
        con.query(`update quizzes set hiddenFlag = ${mysql.escape(hideFlag)} where quizId = ${mysql.escape(quizId)}`, (error, results, fields) => {
            if (error) {
                console.log(error.stack);
                con.end();
                resolve();
                return;
            }
            
            console.log(`successfully hid quiz.`);
            con.end();
            resolve(results);
        });
    });
}


module.exports = {updateConfidence, getConfidence, getAvgConfidence, getAllConfidence, setDueDate, getStudentsQuizzes, getStudentGrades, getClassGrades, getStudentAverageClassGrade, updateGrade, updateHideFlag}