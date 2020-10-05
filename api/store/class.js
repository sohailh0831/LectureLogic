var express = require('express');
const flash = require('connect-flash');
const uuid = require('uuid');
const mysql = require("mysql");


/* --- Adds a student to a class --- */
/* --- Updates class's student list and user's class list --- */
export const addStudentToClass = (req, res) => {
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
        
        if ( listStud.includes(studentId.toString()) ) {
            console.log("ALREADY CONTAINS IT");
        } else {
            listStud.push(studentId.toString());
            console.log("UPDATED LIST: "+listStud);
        }

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

}

// router.post('/addStudentToClass', function(req, res, next) {
// });

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
                    res.status(400).send(error);
                    return;
                }

                console.log("Results3 ");
                console.log(results);
                console.log("\nResults4: ");
                console.log(results2);
                console.log(`${req.body.classId} successfully added.`);
                con.end();
        });

    });

}





// export const resetEmail = (req, res) => {
//     let username = req.body.username;
//     let email = req.body.email;
//     let newEmail = '';
//     con.query(`UPDATE user SET email = ${mysql.escape(newEmail)} WHERE email = ${mysql.escape(email)}, username = ${mysql.escape(username)};`, (error, results, fields) =>  {
//         if (error) {
//             console.log(error.stack);
//             con.end();
//             return;
//         }
//         if (results) {
//             console.log(`${req.body.newEmail} successfully registered.`);
//             con.end();
//             req.flash('success', 'Successfully updated.');
//             return res.redirect('/login');
//         }
//         else {
//             con.end();
//             req.flash('error', 'Something Went Wrong. Try Again.');
//             return res.redirect('/register');
//         }
//     });
// }