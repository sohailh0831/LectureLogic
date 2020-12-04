require('mocha');

const {assert} = require('chai');
var axios = require('axios');
const { get, noConflict } = require('lodash');
var authCookie;
const { classList, addStudentToClass, getInstructorClasses, getStudentClasses, getComments, postClassQuestion, answerClassQuestion, getClassQuestions } = require("../../store/class");
const nock = require('nock');
const fetch = require("node-fetch");
const { instructorSchools } = require('../../store/school');
const { officialSchools } = require('../../store/school');
const { addClass } = require('../../store/class');
const mysql = require("mysql");
const dotenv = require('dotenv').config();
var express = require('express');
var expressValidator = require('express-validator');
var app = express();
const {getStudentAverageClassGrade, getClassGrades, getStudentGrades, getAllConfidence, getAvgConfidence} = require('../../store/quiz');
app.use(expressValidator());
var app = express.Router();

// describe('Login', async function () {
//     describe('logging in', async function() {
//       it('login Response Status Should be 200', async function () {
//           let result = await fetch("http://localhost:9000/login", {
//             method: 'POST',
//             credentials: "include",
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Credentials': true,
//             },
//             body: JSON.stringify({
//                 username: "harry",
//                 password: "harry",
//             })
//         });
        
   
//         console.log(result);
//         //   result.headers = JSON.parse((JSON.stringify(result.headers)).replace('set-cookie', 'setcookie'));
//         //   //console.log(result.headers.setcookie);
//         //   result.headers.setcookie = JSON.parse((JSON.stringify(result.headers.setcookie)).replace('connect.sid', 'connectsid'));
//         //   //console.log(result.headers.setcookie);
//         //   authCookie = JSON.stringify(result.headers.setcookie)
//         //   authCookie = authCookie.substring(13, authCookie.indexOf(';'));
//         //   console.log(authCookie);
//       });
//     });
//   });

  describe('Server Class', async function () {
    describe('test good instructorSchools', async function() {
      it('instructorSchools Response Status Should be 200', async function () {
        let req = {key: 'object'};
        let res;

        let result = await instructorSchools(req, res);
        assert.isNotNull(result, "TEST");
      });
      if('instructorSchools Response Includes Schools Purdue and "" ', async function () {
        let req = {key: 'object'};
        let res;

        let result = await instructorSchools(req, res);
        assert.equal(result[0].school, "Purdue");
        assert.equal(result[1].school, "");
      });
    });
  });

describe('Server Class', async function () {
  describe('test good classList', async function() {
    it('classList Response Status Should be 200', async function () {
             
        let req = {key: 'object'};
        let res;
        let result = await classList(req, res);
        //console.log(result);
        
        assert.isNotNull(result, "YUP");
        //assert.equal(result.status, 200);
    });
    it('classList Response body data should contain three class names and descriptions', async function () {
        let req = {key: 'object'};
        let res;
        let result = await classList(req, res);
        //console.log(result);
        
        assert.equal(result[0].name, "CS407");
        assert.equal(result[1].name, "CS252");
        assert.equal(result[2].name, "CLASS");
     });
 });
});



  describe('Server Class', async function () {
    describe('test good officialSchools', async function() {
      it('officialSchools Response Status Should be 200', async function () {

        let req = {key: 'object'};
        let res;
        let result = await officialSchools(req, res);
          
        assert.isNotNull(result, "not null");
      });
      it('instructorSchools Response body data should contain 2 school nmes', async function () {

        let req = {key: 'object'};
        let res;
        let result = await officialSchools(req, res);
        
        assert.equal(result[0].LocationName, "Purdue University Fort Wayne");
        assert.equal(result[13].LocationName, "Purdue University Global");
      });
    });
  });

  describe('Server Class', async function () {
    describe('test good addClass', async function() {
      it('addClass Good Response Status Should be 200', async function () {
   
        let req = {body: {name: 'CLASS2', description: 'This is the unit test class', instructor_id: 'sffsaf'} };
        let res;
        let result = await addClass(req, res);

        assert.isNotNull(result, "not null");
            
    });
      it('Querying class to make sure new class was inserted', async function () {
        let req = {body: {name: 'CLASS2', description: 'This is the unit test class', instructor_id: 'sffsaf'} };
        let res;
        let result = await classList(req, res);

        assert.equal(result[3].name, "testClass");
        assert.equal(result[3].description, "Paul is cool");
     });
    });
  });

  describe('Server Class', async function () {
    describe('test bad addClass', async function() {
      it('addClass missing instructor_id Response Status Should be 400', async function () {
        try {  
            let req = {body: {name: 'CLASS2', description: 'This is the unit test class'} };
            let res;
            let result = await classList(req, res);
        } catch (error) {
          assert.equal(error.response.status, 400);
        }
      });
      it('addClass missing description Response Status Should be 400', async function () {
        try {
            let req = {body: {name: 'CLASS2', instructor_id: 5} };
            let res;
            let result = await classList(req, res);
        } catch (error) {
          assert.equal(error.response.status, 400);
        }
      });
      it('addClass missing name Response Status Should be 400', async function () {
        try { 
            let req = {body: {description: 'This is the unit test class', nstructor_id: 5} };
            let res;
            let result = await classList(req, res);
        } catch (error) {
          assert.equal(error.response.status, 400);
        }
      });
      it('addClass wrong data type Response Status Should be 400', async function () {
        try {  
            let req = {body: {name: 10, description: 'This is the unit test class', nstructor_id: 5} };
            let res;
            let result = await classList(req, res);
        } catch (error) {
          assert.equal(error.response.status, 400);
        }
      });
     });
  });


  describe('Get Instructor Classes', async function () {
    describe('test bad get instructor classes', async function () {
        it('getINstructorClasses has user id ', async function () {
          try {
            let req =  {query: {user_id: 10}};
            let res;
            let result = await getInstructorClasses(req, res);
            console.log(result);
          }catch (error) {
            assert.error(error.response.status, 400);
          }
        });
    });
  });
  describe('Get Instructor Classes', async function () {
    describe('test good get instructor classes', async function () {
        it('getINstructorClasses has user id ', async function () {
          try {
            let req =  {query: {user_id: "sffsaf"}};
            let res;
            let result = await getInstructorClasses(req, res);
            console.log(result);
            assert.equal(result[1].name, "CLASS2");
            assert.equal(result[1].description, "This is the unit test class");
            //assert.equal(res.status, 200);
          }catch (error) {
            assert.error(error.response.status, 400);
          }
        });
    });
  });

  describe('Get Student Classes', async function () {
    describe('test bad get student classes', async function () {
        it('getStudentClasses has user id ', async function () {
          try {
            let req =  {query: {user_id: 0}};
            let res;
            let results = await getStudentClasses(req, res);
            console.log(results);
          }catch (error) {
            assert.error(error.response.status, 400);
          }
        });
    });
  });
  describe('Get student Classes', async function () {
    describe('test good get student classes', async function () {
        it('getStudentClasses has user id ', async function () {
          try {
            let req =  {query: {user_id: "6cc84664-b5be-4e56-b11b-d9f6c0a11bf4"}};
            console.log("QUERY: "+req.query.user_id);
            let res;
            let results = await getStudentClasses(req, res);
            //console.log(results);
            assert.equal(results[0].name, 'CS407');
            assert.equal(results[0].description, "CS407: Software Engineering Senior Project");
          }catch (error) {
            console.log("error in good get)");
            assert.error(error.response.status, 400);
          }
        });
    });
  });

  describe('Post class question', async function () {
    describe('test bad post class question', async function () {
        it('postClass question bad ', async function () {
          try {
            let req =  {body: {name: "unit t", question: 'unit t q'}};
            let response;
            let results = await postClassQuestion(req, response);
            //assert
            //assert.isNull(results, "null");
            //assert.equals(response.status, 400);
          }catch (error) {
            //console.log(error);
            assert.error(error.response.status, 400);
          }
        });
    });
  });
  describe('Post class question', async function () {
    describe('test good post class question', async function () {
        it('postClass question good ', async function () {
          try {
            let req =  {body: {name: "unit t", question: 'unit t q', classId: 100}};
            let response;
            let results = await postClassQuestion(req, response);
            //assert
            assert.isNotNull(results, "not null");
          }catch (error) {
            //console.log(error);
            assert.error(error.response.status, 400);
          }
        });
    });
  });

  describe('answer class question', async function () {
    describe('test bad answer class question', async function () {
        it('answer question bad ', async function () {
          try {
            let req =  {body: {questionId: '4302591d-60de-4b59-94f1-317fb21a4ccb'}};
            let response;
            let results = await answerClassQuestion(req, response);
            //assert
            assert.equals(response.status, 400);
          }catch (error) {
            //console.log(error);
            assert.isNotNull(error, 'there was an error');
          }
        });
    });
  });
  describe('answer class question', async function () {
    describe('test good answer class question', async function () {
        it('answer question good ', async function () {
          try {
            let req =  {body: {questionId: '21adad82-26e1-4e37-af99-d990cc54af52', answer: "unit test answer"}};
            let response;
            let results = await answerClassQuestion(req, response);
            //assert
            console.log(results);
            assert.isNotNull(results, "not null");
          }catch (error) {
            console.log(error);
            assert.isNotNull(error, 'there was an error');
            //assert.error(error.response.status, 400);
          }
        });
    });
  });
  describe('get class question', async function () {
    describe('test get answer class question', async function () {
        it('get question bad ', async function () {
          try {
            let req =  {query: {classId: 100}};
            let response;
            let results = await getClassQuestions(req, response);
            //assert
            console.log(results);
            assert.isNotNull(results, "not null");
            assert.equal(results[0].question, "unit t q");
            assert.equal(results[0].answer, "unit test answer");
          }catch (error) {
            console.log(error);
            assert.isNotNull(error, 'there was an error');
            //assert.error(error.response.status, 400);
          }
        });
    });
  });

  describe('get class comments', async function () {
    describe('test get answer class comments', async function () {
        it('get question bad ', async function () {
          try {
            let req =  {query: {questionId: 'be52bcfc-be01-4f9b-88d8-a180152772bb'}};
            let response;
            let results = await getComments(req, response);
            //assert
            console.log(results);
            assert.isNotNull(results, "not null");
            //assert.include(results[0].comment, "First inserted comment from function");
            assert.equal(results[0].commenter, "nick");
          }catch (error) {
            console.log(error);
            assert.isNotNull(error, 'there was an error');
            //assert.error(error.response.status, 400);
          }
        });
    });
  });

  describe('get student average class grade', async function() {
    describe('test get student avg BAD', async function () {
      it('get bad', async function () {
        try{
            let req =  {query: {studentId: 'c631f41e-4726-4ccc-be72-f517f4d2b662', classId: 96}};
            let response;
            let results = await getStudentAverageClassGrade(req, response);
            //assert
            console.log(results);

        }catch(error) {
          console.log(error);
          assert.isNotNull(error, 'there was an error');
        }
      });
    });
  });
  
  describe('get student average class grade', async function() {
    describe('test get student avg good', async function () {
      it('get good', async function () {
        try{
            let req =  {query: {studentId: 'c631f41e-4726-4ccc-be72-f517f4d2b662', classId: 97}};
            let response;
            let results = await getStudentAverageClassGrade(req, response);
            //assert
            console.log(results);
            assert.isNotNull(results, "not null");
            //assert.include(results[0].comment, "First inserted comment from function");
            assert.equal(results[0].avgGrade, 87.5714);

        }catch(error) {
          console.log(error);
          assert.isNotNull(error, 'there was an error');
        }
      });
    });
  });

  describe('get class grade', async function() {
    describe('test get class BAD', async function () {
      it('get bad', async function () {
        try{
            let req =  {query: {classId: 96}};
            let response;
            let results = await getClassGrades(req, response);
            //assert
            console.log(results);
            //assert.isNotNull(results, "not null");
            assert.isEmpty(results);
        }catch(error) {
          console.log(error);
          assert.isNotNull(error, 'there was an error');
        }
      });
    });
  });

  describe('get class grade', async function() {
    describe('test get class grade good', async function () {
      it('get good', async function () {
        try{
            let req =  {query: {classId: 97}};
            let response;
            let results = await getClassGrades(req, response);
            //assert
            console.log(results);
            assert.isNotNull(results, "not null");
            //assert.include(results[0].comment, "First inserted comment from function");
            assert.equal(results[0].score, 13);
            assert.equal(results[0].classId, 97);
        }catch(error) {
          console.log(error);
          assert.isNotNull(error, 'there was an error');
        }
      });
    });
  });

  describe('get student grade', async function() {
    describe('test get student BAD', async function () {
      it('get bad', async function () {
        try{
            let req =  {query: {studentId: 'c631f41e-4726-4ccc-be72-f517f4d2b66'}};
            let response;
            let results = await getStudentGrades(req, response);
            //assert
            console.log(results);
            assert.isNotNull(results, "not null");
            assert.isEmpty(results);
        }catch(error) {
          console.log(error);
          assert.isNotNull(error, 'there was an error');
        }
      });
    });
  });

  describe('get student grade', async function() {
    describe('test get student good', async function () {
      it('get good', async function () {
        try{
            let req =  {query: {studentId: 'c631f41e-4726-4ccc-be72-f517f4d2b662'}};
            let response;
            let results = await getStudentGrades(req, response);
            //assert
            console.log(results);
            assert.isNotNull(results, "not null");
            //assert.include(results[0].comment, "First inserted comment from function");
            assert.equal(results[0].score, 13);
            assert.equal(results[0].classId, 97);
        }catch(error) {
          console.log(error);
          assert.isNotNull(error, 'there was an error');
        }
      });
    });
  });

  describe('get student quizzes', async function() {
    describe('test get student quizzes bad', async function () {
      it('get bad', async function () {
        try{
            let req =  {query: {quizId: -1}};
            let response;
            let results = await getAvgConfidence(req, response);
            //assert
            console.log(results);
            assert.isNotNull(results, "not null");
            //assert.include(results[0].comment, "First inserted comment from function");
            assert.isNotNull(results, "not null");
              //           assert.isEmpty(results);
        }catch(error) {
          console.log(error);
          assert.isNotNull(error, 'there was an error');
        }
      });
    });
  });

  describe('get student quizzes', async function() {
    describe('test get student quizzes good', async function () {
      it('get good', async function () {
        try{
            let req =  {query: {quizId: 3}};
            let response;
            let results = await getAvgConfidence(req, response);
            //assert
            console.log(results);
            assert.isNotNull(results, "not null");
            //assert.include(results[0].comment, "First inserted comment from function");
            assert.equal(results, 8);
            //assert.equal(results[0].classId, 97);
        }catch(error) {
          console.log(error);
          assert.isNotNull(error, 'there was an error');
        }
      });
    });
  });

  describe('get student quizzes', async function() {
    describe('test get student quizzes bad', async function () {
      it('get bad', async function () {
        try{
            let req =  {query: {quizId: -1}};
            let response;
            let results = await getAllConfidence(req, response);
            //assert
            console.log(results);
            assert.isNotNull(results, "not null");
            //assert.include(results[0].comment, "First inserted comment from function");
            assert.isNotNull(results, "not null");
              //           assert.isEmpty(results);
        }catch(error) {
          console.log(error);
          assert.isNotNull(error, 'there was an error');
        }
      });
    });
  });

  describe('get student quizzes', async function() {
    describe('test get student quizzes good', async function () {
      it('get good', async function () {
        try{
            let req =  {query: {quizId: 3}};
            let response;
            let results = await getAllConfidence(req, response);
            //assert
            console.log(results);
            assert.isNotNull(results, "not null");
            //assert.include(results[0].comment, "First inserted comment from function");
            //ssert.equal(results[0].confidence, "8");
            assert.equal(results[0].name, 'test1');
        }catch(error) {
          console.log(error);
          assert.isNotNull(error, 'there was an error');
        }
      });
    });
  });

  describe('get class grade', async function() {
    describe('test get class BAD', async function () {
      it('get bad', async function () {
        try{
            let req =  {query: {classId: -1}};
            let response;
            let results = await getClassGrades(req, response);
            //assert
            console.log(results);
            //assert.isNotNull(results, "not null");
            assert.isEmpty(results);
        }catch(error) {
          console.log(error);
          assert.isNotNull(error, 'there was an error');
        }
      });
    });
  });

  describe('get class grade', async function() {
    describe('test get class grade good', async function () {
      it('get good', async function () {
        try{
            let req =  {query: {classId: 97}};
            let response;
            let results = await getClassGrades(req, response);
            //assert
            console.log(results);
            assert.isNotNull(results, "not null");
            //assert.include(results[0].comment, "First inserted comment from function");
            assert.equal(results[0].score, 13);
            assert.equal(results[0].classId, 97);
        }catch(error) {
          console.log(error);
          assert.isNotNull(error, 'there was an error');
        }
      });
    });
  });