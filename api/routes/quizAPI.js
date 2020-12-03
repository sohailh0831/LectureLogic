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




router.post('/deleteQuizQuestion', AuthenticationFunctions.ensureAuthenticated, async function(req,res,next){
    let questionId = req.body.questionId;
    let con = mysql.createConnection(dbInfo);
    con.query(`DELETE FROM quizQuestionTable WHERE quizQuestionId = ${mysql.escape(questionId)};`, (error, results, fields) => {
        if (error) {
            console.log(error.stack);
        }
            con.end();
        res.send(results);
        return;
});

});

router.post('/publishQuiz', AuthenticationFunctions.ensureAuthenticated, async function(req,res,next){
    let quizId = req.body.quizId;
    let current = req.body.isPublished;
    let update =0;
    if(current == 0){
        update = 1; //if publish is 0 make it 1
    }
    let con = mysql.createConnection(dbInfo);
    con.query(`UPDATE quizzes SET isPublished = ${mysql.escape(update)} WHERE quizId = ${mysql.escape(quizId)};`, (error, results, fields) => {
        if (error) {
            console.log(error.stack);
        }
            con.end();
            res.send("\"OK\"");
        return;
});

});


router.post('/saveQuizScores', AuthenticationFunctions.ensureAuthenticated, async function(req,res,next){
    let quizId = req.body.quizId;
    let userId = req.body.userId;
    let selections = JSON.parse(req.body.selections);
    let questionList = JSON.parse(req.body.questionList);

    // var i;
   // console.log("HERE")
    //console.log(selections['11']);
   // console.log(questionList[0].quizQuestionId);

    for (var key in selections) { //loop through all of user's selections
        // check if the property/key is defined in the object itself, not in parent
        if (selections.hasOwnProperty(key)) {           
            //key is the questionId
            //selections[key] is users answer choice (e.g. A,B,C,D)

            var index;
            var correctAnswer;
            var isCorrect =0;
            for(index=0; index < questionList.length; index++){
                //console.log(questionList[index].quizQuestionId.toString());
                if(questionList[index].quizQuestionId.toString() == key){
                    correctAnswer = questionList[index].quizQuestionAnswer;
                    if(correctAnswer == selections[key]){ //if answer is correct
                        isCorrect =1;
                        console.log("Correct Answer");
                    }
                 //insert selections into DB
                 //insert into question table (studentId = userId, quizId = quizId, studentAnswer = selections[key], questionId = questionList[index].quizQuestionId, isCorrect)
                    insertStudentAnswer(userId,quizId,selections[key],questionList[index].quizQuestionId,isCorrect);
                }
            }
        }
    }

//     let con = mysql.createConnection(dbInfo);
//     con.query(`UPDATE quizzes SET isPublished = ${mysql.escape(update)} WHERE quizId = ${mysql.escape(quizId)};`, (error, results, fields) => {
//         if (error) {
//             console.log(error.stack);
//         }
//             con.end();
//             res.send("\"OK\"");
//         return;
// });
    res.send("\"OK\"");
});


function insertStudentAnswer(studentId, quizId, studentAnswer, questionId, isCorrect){
        let con = mysql.createConnection(dbInfo);
        console.log(studentId)


        //check if entry already exists
        con.query(`SELECT * FROM quizQuestionAnswer WHERE questionId=${mysql.escape(questionId)} AND studentId=${mysql.escape(studentId)} AND quizId = ${mysql.escape(quizId)};`, (error, results, fields) => {
                if (error) {
                    console.log(error.stack);
                }
                if(results.length > 0){ //Found previous entry... need to UPDATE instead of INSERT
                    con.query(`update quizQuestionAnswer set studentAnswer=${mysql.escape(studentAnswer)}, correctFlag=${mysql.escape(isCorrect)} where questionId=${mysql.escape(questionId)} AND studentId=${mysql.escape(studentId)} AND quizId= ${mysql.escape(quizId)};`, (error, results, fields) => {
                        if (error) {
                            console.log(error.stack);
                        }
            
                            con.end();
                            //res.send("\"OK\"");
                        return;
                });
                }
                else{ // no previous entry... need to insert
                    con.query(`insert into quizQuestionAnswer (studentId,quizId,studentAnswer,questionId,correctFlag) values(${mysql.escape(studentId)},${mysql.escape(quizId)},${mysql.escape(studentAnswer)},${mysql.escape(questionId)},${mysql.escape(isCorrect)});`, (error, results, fields) => {
                        if (error) {
                            console.log(error.stack);
                        }
            
                            con.end();
                            //res.send("\"OK\"");
                        return;
                });

                }
                    //con.end();
                    //res.send("\"OK\"");
                return;
        });
        



/*
con.query(`IF EXISTS(select * from quizQuestionAnswer where questionId=${mysql.escape(questionId)} AND studentId=${mysql.escape(studentId)} AND quizId = ${mysql.escape(quizId)}) update quizQuestionAnswer set studentAnswer=${mysql.escape(studentAnswer)}, correctFlag=${mysql.escape(isCorrect)} where questionId=${mysql.escape(questionId)} AND studentId=${mysql.escape(studentId)} AND quizId= ${mysql.escape(quizId)} 
    ELSE insert into quizQuestionAnswer (studentId,quizId,studentAnswer,questionId,correctFlag) values(${mysql.escape(studentId)},${mysql.escape(quizId)},${mysql.escape(studentAnswer)},${mysql.escape(questionId)},${mysql.escape(isCorrect)});`, (error, results, fields) => {
*/

/*
con.query(`update quizQuestionAnswer set studentAnswer=${mysql.escape(studentAnswer)}, correctFlag=${mysql.escape(isCorrect)} where questionId=${mysql.escape(questionId)} AND studentId=${mysql.escape(studentId)} AND quizId= ${mysql.escape(quizId)} 
IF @@ROWCOUNT=0 
insert into quizQuestionAnswer (studentId,quizId,studentAnswer,questionId,correctFlag) values(${mysql.escape(studentId)},${mysql.escape(quizId)},${mysql.escape(studentAnswer)},${mysql.escape(questionId)},${mysql.escape(isCorrect)});`, (error, results, fields) => {
*/

/*
con.query(`insert into quizQuestionAnswer (studentId,quizId,studentAnswer,questionId,correctFlag) values(${mysql.escape(studentId)},${mysql.escape(quizId)},${mysql.escape(studentAnswer)},${mysql.escape(questionId)},${mysql.escape(isCorrect)});`, (error, results, fields) => {
*/


// con.query(`update quizQuestionAnswer set studentAnswer=${mysql.escape(studentAnswer)}, correctFlag=${mysql.escape(isCorrect)} where questionId=${mysql.escape(questionId)} AND studentId=${mysql.escape(studentId)} AND quizId= ${mysql.escape(quizId)} 
// IF @@ROWCOUNT=0 
// insert into quizQuestionAnswer (studentId,quizId,studentAnswer,questionId,correctFlag) values(${mysql.escape(studentId)},${mysql.escape(quizId)},${mysql.escape(studentAnswer)},${mysql.escape(questionId)},${mysql.escape(isCorrect)});`, (error, results, fields) => {
//         if (error) {
//             console.log(error.stack);
//         }
//             con.end();
//             //res.send("\"OK\"");
//         return;
// });
 }




module.exports = router;