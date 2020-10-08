require('mocha');

const {assert} = require('chai');
var axios = require('axios');
const { get, noConflict } = require('lodash');
var authCookie;
const { classList, addStudentToClass, getInstructorClasses } = require("../../store/class");
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
//                 username: "nleuer",
//                 password: "*2Pokemon",
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

        assert.equal(result[3].name, "CLASS2");
        assert.equal(result[3].description, "This is the unit test class");
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



  describe('Server Class', async function () {
    describe('test good addStudentToClass', async function() {
      it('addStudentToClass Response Status Should be 200', async function () {
        
            let req = {body: {studentId: "26968e0c-3ae2-4dd7-aa08-4a1388470f27", classId: 3} };
            let res = { status: ""};
            let result = await addStudentToClass(req, res);
            
            assert.isNotNull(result, "not null");
      });
    });
  });

describe('Server Class', async function () {
    describe('test bad addStudentToClass', async function() {
      it('addStudentToClass where student already enrolled in class. Response Status Should be 400', async function () {
        try{
            let req = {body: {studentId: "26968e0c-3ae2-4dd7-aa08-4a1388470f27", classId: 3} };
            let res = { status: ""};
            let result = await addStudentToClass(req, res);

        } catch (error) {
            assert.equal(error.response.status, 400);
        }
          
      });

      it('addStudentToClass with classId parameter missing. Response Status Should be 400', async function () {
           try{
            let req = {body: {studentId: "26968e0c-3ae2-4dd7-aa08-4a1388470f27"} };
            let res = { status: ""};
            let result = await addStudentToClass(req, res);
          } catch (error) {
              assert.equal(error.response.status, 400);
          }
        });
        it('addStudentToClass with studentId parameter missing. Response Status Should be 400', async function () {
            try{
                let req = {body: {classId: 3} };
                let res = { status: ""};
                let result = await addStudentToClass(req, res);
              } catch (error) {
                  assert.equal(error.response.status, 400);
              }
         });

    });
}); 