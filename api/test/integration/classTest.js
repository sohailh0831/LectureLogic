require('mocha');

const {assert} = require('chai');
var axios = require('axios');
const { get } = require('lodash');

describe('Server Class', async function () {
  describe('test good classList', async function() {
    it('classList Response Status Should be 200', async function () {
        let result = await axios({
          method: 'get',
          url: 'http://127.0.0.1:9000/nick/classList',
        });
        assert.equal(result.status, 200);
    });
    it('classList Response body data should contain three class names and descriptions', async function () {
        let result = await axios({
          method: 'get',
          url: 'http://127.0.0.1:9000/nick/classList',
        });
        assert.equal(result.data[0].name, "CS407");
        assert.equal(result.data[1].name, "CS252");
        assert.equal(result.data[2].name, "CLASS");
    });
  });
});

describe('Server Class', async function () {
    describe('test good instructorSchools', async function() {
      it('instructorSchools Response Status Should be 200', async function () {
          let result = await axios({
            method: 'get',
            url: 'http://127.0.0.1:9000/nick/instructorSchools',
          });
          assert.equal(result.status, 200);
      });
      it('instructorSchools Response body data should contain 2 school nmes', async function () {
          let result = await axios({
            method: 'get',
            url: 'http://127.0.0.1:9000/nick/instructorSchools',
          });
          assert.equal(result.data[0].school, "Purdue");
          assert.equal(result.data[1].school, "");
      });
    });
  });

  describe('Server Class', async function () {
    describe('test good officialSchools', async function() {
      it('officialSchools Response Status Should be 200', async function () {
          let result = await axios({
            method: 'get',
            url: 'http://127.0.0.1:9000/nick/officialSchools',
          });
          assert.equal(result.status, 200);
      });
      it('instructorSchools Response body data should contain 2 school nmes', async function () {
          let result = await axios({
            method: 'get',
            url: 'http://127.0.0.1:9000/nick/officialSchools',
          });
          assert.equal(result.data[0].LocationName, "Purdue University Fort Wayne");
          assert.equal(result.data[13].LocationName, "Purdue University Global");
      });
    });
  });

  describe('Server Class', async function () {
    describe('test good addClass', async function() {
      it('addClass Good Response Status Should be 200', async function () {
          let result = await axios({
            method: 'post',
            url: 'http://127.0.0.1:9000/nick/addClass',
            data: {
                name: 'CLASS2',
                description: 'This is the unit test class',
                instructor_id: 'sffsaf'
            }
          });
          assert.equal(result.status, 200);
          assert.equal(result.data.message, "success");
      });
      it('Querying class to make sure new class was inserted', async function () {
        let result = await axios({
          method: 'get',
          url: 'http://127.0.0.1:9000/nick/classList',
        });
        assert.equal(result.data[3].name, "CLASS2");
        assert.equal(result.data[3].description, "This is the unit test class");
      });
    });
  });

  describe('Server Class', async function () {
    describe('test bad addClass', async function() {
      it('addClass missing instructor_id Response Status Should be 400', async function () {
        try {  
        let result = await axios({
            method: 'post',
            url: 'http://127.0.0.1:9000/nick/addClass',
            data: {
                name: 'CLASS2',
                description: 'This is the unit test class'
                //instructor_id: 'sffsaf'
            }
          });
        } catch (error) {
          assert.equal(error.response.status, 400);
        }
      });
      it('addClass missing description Response Status Should be 400', async function () {
        try {  
        let result = await axios({
            method: 'post',
            url: 'http://127.0.0.1:9000/nick/addClass',
            data: {
                name: 'CLASS2',
                //description: 'This is the unit test class'
                instructor_id: 'sffsaf'
            }
          });
        } catch (error) {
          assert.equal(error.response.status, 400);
        }
      });
      it('addClass missing name Response Status Should be 400', async function () {
        try {  
        let result = await axios({
            method: 'post',
            url: 'http://127.0.0.1:9000/nick/addClass',
            data: {
                //name: 'CLASS2',
                description: 'This is the unit test class',
                instructor_id: 'sffsaf'
            }
          });
        } catch (error) {
          assert.equal(error.response.status, 400);
        }
      });
      it('addClass wrong data type Response Status Should be 400', async function () {
        try {  
        let result = await axios({
            method: 'post',
            url: 'http://127.0.0.1:9000/nick/addClass',
            data: {
                name: 10,
                description: 'This is the unit test class'
                //instructor_id: 'sffsaf'
            }
          });
        } catch (error) {
          assert.equal(error.response.status, 400);
        }
      });
    });
  });



  describe('Server Class', async function () {
    describe('test good addStudentToClass', async function() {
      it('addStudentToClass Response Status Should be 200', async function () {
          let result = await axios({
            method: 'post',
            url: 'http://127.0.0.1:9000/nick/addStudentToClass',
            data: {
                studentId: "26968e0c-3ae2-4dd7-aa08-4a1388470f27",
                classId: 3
            }
          });
          assert.equal(result.status, 200);
          assert.equal(result.data.message, "success");
      });
    });
  });

describe('Server Class', async function () {
    describe('test bad addStudentToClass', async function() {
      it('addStudentToClass where student already enrolled in class. Response Status Should be 400', async function () {
        try{
            let result = await axios({
                method: 'post',
                url: 'http://127.0.0.1:9000/nick/addStudentToClass',
                data: {
                    studentId: "26968e0c-3ae2-4dd7-aa08-4a1388470f27",
                    classId: 3
                }
            });
        } catch (error) {
            assert.equal(error.response.status, 400);
        }
          
      });

      it('addStudentToClass with classId parameter missing. Response Status Should be 400', async function () {
          try{
              let result = await axios({
                  method: 'post',
                  url: 'http://127.0.0.1:9000/nick/addStudentToClass',
                  data: {
                      studentId: "26968e0c-3ae2-4dd7-aa08-4a1388470f27"
                  }
              });
          } catch (error) {
              assert.equal(error.response.status, 400);
          }
        });
        it('addStudentToClass with studentId parameter missing. Response Status Should be 400', async function () {
              try{
                  let result = await axios({
                      method: 'post',
                      url: 'http://127.0.0.1:9000/nick/addStudentToClass',
                      data: {
                          classId: 3
                      }
                  });
              } catch (error) {
                  assert.equal(error.response.status, 400);
              }
        });

    });
});  