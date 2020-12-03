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
        let startDate = req.body.quizStartDate;//need to format to date time
        let dueDate = req.body.quizDueDate; //need to format to datetime
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
        con.query(`SELECT * FROM quizzes WHERE classId = ${mysql.escape(classId)} AND isDeleted=0;`, (error, results, fields) => {
            if (error) {
                console.log(error.stack);
            }
                con.end();
            res.send(results);
            return;
    });
   

});

router.post('/getAllQuizzesStudent', AuthenticationFunctions.ensureAuthenticated, async function(req,res,next){
    let classId = req.body.classId;

    let con = mysql.createConnection(dbInfo);
    con.query(`SELECT * FROM quizzes WHERE classId = ${mysql.escape(classId)} AND isPublished=1 AND isDeleted=0;`, (error, results, fields) => {
        if (error) {
            console.log(error.stack);
        }
            con.end();
        console.log("QUIZZES: ", results)
        let validquiz = [];
        results.forEach(element => {
            let d1 = Date();
            d1 = Date.parse(d1);
            console.log("d1: ",d1);
            let d2 = Date.parse(element.startDate);
            console.log("d2: ",d2);
            if (d1 >= d2 || !element.startDate){
                validquiz.push(element);
            }
        });
        console.log("VALID QUIZZES: ", validquiz)
        res.send(validquiz);
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
                    insertStudentAnswer(userId,quizId,selections[key],questionList[index].quizQuestionId,isCorrect,questionList[index].pointValue);
                }
            }
        }
    }

    res.send("\"OK\"");
});


function insertStudentAnswer(studentId, quizId, studentAnswer, questionId, isCorrect,pointValue){
    return new Promise(resolve => {
        let con = mysql.createConnection(dbInfo);
        console.log(studentId)


        //check if entry already exists
        con.query(`SELECT * FROM quizQuestionAnswer WHERE questionId=${mysql.escape(questionId)} AND studentId=${mysql.escape(studentId)} AND quizId = ${mysql.escape(quizId)};`, (error, results, fields) => {
                if (error) {
                    console.log(error.stack);
                }
                if(results.length > 0){ //Found previous entry... need to UPDATE instead of INSERT
                    con.query(`update quizQuestionAnswer set studentAnswer=${mysql.escape(studentAnswer)}, correctFlag=${mysql.escape(isCorrect)}, questionPoints=${mysql.escape(pointValue)} where questionId=${mysql.escape(questionId)} AND studentId=${mysql.escape(studentId)} AND quizId= ${mysql.escape(quizId)};`, (error, results, fields) => {
                        if (error) {
                            console.log(error.stack);
                        }
            
                            con.end();
                            //res.send("\"OK\"");
                        resolve();    
                        return;
                });
                }
                else{ // no previous entry... need to insert
                    con.query(`insert into quizQuestionAnswer (studentId,quizId,studentAnswer,questionId,correctFlag,questionPoints) values(${mysql.escape(studentId)},${mysql.escape(quizId)},${mysql.escape(studentAnswer)},${mysql.escape(questionId)},${mysql.escape(isCorrect)},${mysql.escape(pointValue)});`, (error, results, fields) => {
                        if (error) {
                            console.log(error.stack);
                        }
            
                            con.end();
                            resolve();    
                        return;
                });

                }
                resolve();
                return;
        });

    });
        
 }


 router.post('/submitQuizScores', AuthenticationFunctions.ensureAuthenticated, async function(req,res,next){
    let quizId = req.body.quizId;
    let userId = req.body.userId;
    let quizName = req.body.quizName;
    let classId = req.body.classId;
    let con = mysql.createConnection(dbInfo);
    let totalPoints =  await getTotalPointsForQuiz(quizId,userId);
    let studentScore =  await getStudentsScoreForQuiz(quizId,userId); 
    let percent = Math.ceil((studentScore* 100) /totalPoints);
    
    console.log("total: " + totalPoints + " your score: " + studentScore);
    console.log(percent + "%");

    con.query(`INSERT quizGradeStudents (quizId,classId,studentId,quizName,score,rawPoints,totalPoints,hasFinished) VALUES(${mysql.escape(quizId)},${mysql.escape(classId)},${mysql.escape(userId)},${mysql.escape(quizName)},${mysql.escape(percent)},${mysql.escape(studentScore)},${mysql.escape(totalPoints)},1);`, (error, results, fields) => {
        if (error) {
            console.log(error.stack);
        }
            con.end();
        return;
        });

    res.send("\"OK\"");

});

 function getTotalPointsForQuiz(quizId,userId){
    return new Promise(resolve => {
    let con = mysql.createConnection(dbInfo);
     con.query(`SELECT SUM(questionPoints) FROM quizQuestionAnswer WHERE quizId= ${mysql.escape(quizId)} AND studentId = ${mysql.escape(userId)};`, (error, results, fields) => {
        if (error) {
            console.log(error.stack);
        }
            let key = "SUM(questionPoints)";
            var totalPoints = results[0][key];
            con.end();
            console.log(totalPoints);
        resolve(totalPoints);
        return;
        });
    });
}

 function getStudentsScoreForQuiz(quizId,userId){
    return new Promise(resolve => {
    let con = mysql.createConnection(dbInfo);
     con.query(`SELECT SUM(questionPoints) FROM quizQuestionAnswer WHERE quizId= ${mysql.escape(quizId)} AND studentId = ${mysql.escape(userId)} AND correctFlag=1;`, (error, results, fields) => {
        if (error) {
            console.log(error.stack);
        }
            let key = "SUM(questionPoints)";
            var studentScore = 0;
            if(results[0][key] > 0){
                studentScore = results[0][key];
            }
            con.end();
            console.log(studentScore);
            resolve(studentScore);
            return;
        });
    });
}

router.post('/getAnsweredQuestions', AuthenticationFunctions.ensureAuthenticated, async function(req,res,next){
    let quizId = req.body.quizId;
    let userId = req.body.userId;
    let con = mysql.createConnection(dbInfo);
    con.query(`SELECT questionId, studentAnswer FROM quizQuestionAnswer WHERE quizId = ${mysql.escape(quizId)} AND studentId = ${mysql.escape(userId)};`, (error, results, fields) => {
        if (error) {
            console.log(error.stack);
        }
        console.log("ayup",results)
        con.end();
        res.send(results);
        return;
    });
});

router.post('/getCompletedQuizzes', AuthenticationFunctions.ensureAuthenticated, async function(req,res,next){
    let classId = req.body.classId;
    let userId = req.body.userId;
    console.log(req.body.classId + " " + req.body.userId)
    let update =0;
    let con = mysql.createConnection(dbInfo);
    con.query(`SELECT quizId FROM quizGradeStudents WHERE classId=${mysql.escape(req.body.classId)} AND studentId = ${mysql.escape(req.body.userId)};`, (error, results, fields) => {
        if (error) {
            console.log(error.stack);
        }
        console.log(results)
            con.end();
            res.send(results);
        return;
});

});


router.post('/deleteQuiz', AuthenticationFunctions.ensureAuthenticated, async function(req,res,next){
    let quizId = req.body.quizId;
    let con = mysql.createConnection(dbInfo);
    con.query(`UPDATE quizzes SET isDeleted=1 WHERE quizId = ${mysql.escape(quizId)};`, (error, results, fields) => {
        if (error) {
            console.log(error.stack);
        }
        console.log(results)
            con.end();
            res.send(results);
        return;
});

});





module.exports = router;