var express = require("express");
const { isNull } = require("lodash");
var router = express.Router();
const dotenv = require('dotenv').config();
const mysql = require("mysql");

let dbInfo = {
    connectionLimit: 100,
    host: '134.122.115.102',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306,
    multipleStatements: true
  };


router.get('/nickTest', function(req, res, next){
   // res.send("Nicks second api is working!!!!!!!!!!!!!!");
    let con = mysql.createConnection(dbInfo);

   
    con.query("select * from student", (err, results, fields) => {
        if (err) {
            console.log(err.stack);
            con.end();
            return;
        }
        console.log(results);
        con.end();
        res.send(results);
    });
  

});

router.post('/createStudent', function(req, res, next) {
    let con = mysql.createConnection(dbInfo);
    
    var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;
    var email = req.body.email;
    var phone_number = req.body.phone_number || '';

    con.query("insert into student (username, password, name, email, phone_number ) values ( '"+username+"', '"+password+"', '"+name+"', '"+email+"', '"+phone_number+"' )", (err, results, fields) => {
        if (err) {
            console.log(err.stack);
            con.end();
            return;
        }
        console.log(results);
        con.end();
        res.send(results);
    })

})

router.post('/createStudent', function(req, res, next) {
    let con = mysql.createConnection(dbInfo);
    
    var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;
    var email = req.body.email;
    var phone_number = req.body.phone_number || '';

    con.query("insert into student (username, password, name, email, phone_number ) values ( '"+username+"', '"+password+"', '"+name+"', '"+email+"', '"+phone_number+"' )", (err, results, fields) => {
        if (err) {
            console.log(err.stack);
            con.end();
            return;
        }
        console.log(results);
        con.end();

        //call createUserStudent function using results[3]
        res.send(results);
    })

})

router.post('/createUser/Student', function(req, res, next) {
    let con = mysql.createConnection(dbInfo);

    var type_id = req.body.type_id;

    con.query("insert into user (type, type_id) values (1, "+type_id+")", (err, results, fields) => {
        if (err) {
            console.log(err.stack);
            con.end();
            return;
        }
        console.log(results);
        con.end();
        res.send(results);
    })
})

router.post('/createTeacher', function(req, res, next) {
    let con = mysql.createConnection(dbInfo);
    
    var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;
    var title = req.body.title;
    var email = req.body.email;
    var phone_number = req.body.phone_number || '';

    con.query("insert into teacher (username, password, name, title, email, phone_number ) values ( '"+username+"', '"+password+"', '"+name+"', '"+title+"', '"+email+"', '"+phone_number+"' )", (err, results, fields) => {
        if (err) {
            console.log(err.stack);
            con.end();
            return;
        }
        console.log(results);
        con.end();

        //call createUserStudent function using results[3]
        res.send(results);
    })

})

router.post('/createUser/Teacher', function(req, res, next) {
    let con = mysql.createConnection(dbInfo);

    var type_id = req.body.type_id;

    con.query("insert into user (type, type_id) values (0, "+type_id+")", (err, results, fields) => {
        if (err) {
            console.log(err.stack);
            con.end();
            return;
        }
        console.log(results);
        con.end();
        res.send(results);
    })
})

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

router.post('/addStudentToClass', function(req, res, next) {
    let studentId = req.body.studentId;
    let classId = req.body.classId;

    req.checkBody('studentId', 'studentId field is required.').notEmpty();
    req.checkBody('classId', 'classId field is required.').notEmpty();

    let con = mysql.createConnection(dbInfo);
    con.query(`select student_list from class where id = ${mysql.escape(classId)}`, (error, results, fields) => {
        if (error) {
            console.log(error.stack);
            con.end();
            res.status(400).send(error);
            return;
        }
        

        if ( isNull(results[0].student_list) ) {
            results[0].student_list = `[ "${mysql.escape(studentId)}" ]`;
        }

        var listStud = JSON.parse(results[0].student_list);
        listStud.push(studentId.toString());
        console.log("UPDATED LIST: "+listStud);

        con.query(`update class set student_list = ${mysql.escape(JSON.stringify(listStud))} where id = ${mysql.escape(classId)}`, (error2, results2, fields2) => {
                if (error2) {
                    console.log(error2.stack);
                    con.end();
                    res.status(400).send(error);
                    return;
                }

                addClassToStudent(studentId, classId, req, res, next);

                console.log("Results1: " + results + "\nResults2: " + results2);
                console.log(`${req.body.studentId} successfully added.`);
                con.end();
                req.flash('success', 'Successfully created class.');
                res.send(results2);
                
        });

    });
    

});

//incorporate this in previous call
function addClassToStudent(studentId, classId, req, res, next) {
    let con = mysql.createConnection(dbInfo);
    con.query(`select class_list from user where id = ${mysql.escape(studentId)}`, (error, results, fields) => {
        if (error) {
            console.log(error.stack);
            con.end();
            res.status(400).send(error);
            return;
        }
        
        console.log(results);
        if ( isNull(results[0].class_list) ) {
            results[0].class_list = `[ "${mysql.escape(studentId)}" ]`;
        }

        var listStud = JSON.parse(results[0].class_list);
        listStud.push(classId.toString());
        console.log("UPDATED LIST: "+listStud);

        con.query(`update user set class_list = ${mysql.escape(JSON.stringify(listStud))} where id = ${mysql.escape(studentId)}`, (error2, results2, fields2) => {
                if (error2) {
                    console.log(error2.stack);
                    con.end();
                    res.status(400).send(error);
                    return;
                }

                console.log("Results3: " + results + "\nResults4" + results2);
                console.log(`${req.body.classId} successfully added.`);
                con.end();
                //req.flash('success', 'Successfully added class to student\'s list.');
                //res.send(results2);
                //return results2;
        });

    });

}

module.exports = router;