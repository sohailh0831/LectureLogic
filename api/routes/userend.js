var express = require('express');
var router = express.Router();
var passport = require("passport");
const flash = require('connect-flash');
const uuid = require('uuid');
const mysql = require("mysql");
const bcrypt = require('bcrypt');
const { resetEmail } =  require("../store/reset");
const { addStudentRequest, getStudentRequests, addStudentToClass } =  require("../store/class");
const { updateConfidence, getAvgConfidence, getConfidence } =  require("../store/quiz");
const { postMessage, 
        clearNotifications, 
        clearNotificationsByClass, 
        getMessages, 
        getMessagesByClass, 
        getNotifications,
        getNotificationsByClass
      } = require("../store/notification")
//for passport
const LocalStrategy = require('passport-local').Strategy;
const AuthenticationFunctions = require('../Authentication.js');

// import {
//   resetEmail,
// } from '../store/reset';

let dbInfo = {
  connectionLimit: 100,
  host: '134.122.115.102',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
  multipleStatements: true
};


passport.use(new LocalStrategy({ passReqToCallback: true, },
  function (req, username, password, done) {
    let con = mysql.createConnection(dbInfo);
    con.query(`SELECT * FROM user WHERE username=${mysql.escape(username)};`, (error, results, fields) => {
      if (error) {
        console.log(error.stack);
        con.end();
        return;
      }
      if (results.length === 0) {
        con.end();
        return done(null, false, req.flash('error', 'Username or Password is incorrect.'));
      } else {
        if (bcrypt.compareSync(password, results[0].password)) {
          let user = {
            id: results[0].id,
            username: results[0].username,
            password: results[0].password,
            name: results[0].name,
            type: results[0].type,
            email: results[0].email,
            phone_number: results[0].phone_number,
            school: results[0].school,
            class_list: results[0].class_list,
          };
          con.end();
          //return done(null, user);
          return done(null, { id: user.id, username: user.username, name: user.username, type: user.type, email: user.email, phone_number: user.phone_number, school: user.school, class_list: user.class_list, password: user.password})
        } else {
          con.end();
          return done(null, false, req.flash('error', 'Username or Password is incorrect.'));
        }

      }
  });

}));


passport.serializeUser(function (uuid, done) {
  done(null, uuid);
});


router.get('/', AuthenticationFunctions.ensureAuthenticated,function(req, res, next) {
    res.render('index.ejs', { name: req.user.name });
});

  
passport.deserializeUser(function (uuid, done) {
  done(null, uuid);
});



router.get('/', AuthenticationFunctions.ensureAuthenticated, (req, res) => {
  return res.render('index.ejs', { name: req.user.name }, {
    error: req.flash('error'),
    success: req.flash('success'),
  });
});

router.get('/postLogin', AuthenticationFunctions.ensureAuthenticated, (req, res) => {
  return res.send("\"OK\"")
});

router.get('/dashboard', AuthenticationFunctions.ensureAuthenticated, (req, res) => {
  return res.send(req.user);
});

router.post('/changePassword', AuthenticationFunctions.ensureAuthenticated, (req, res) => {
  let currentPassword = req.body.currentPassword;
  let newPassword = req.body.newPassword;
  let reNewPassword = req.body.reNewPassword;
  let userId = req.user.id;

  if (bcrypt.compareSync(currentPassword, req.user.password)) { // compare current password
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(newPassword, salt);
    let con = mysql.createConnection(dbInfo);
    con.query(`UPDATE user SET password = ${mysql.escape(hashedPassword)} WHERE id=${mysql.escape(userId)};`, (error, results, fields) => {
      if (error) {
        console.log(error.stack);
      }
      con.end();
      res.send("\"OK\"");
      return;
  });
}
  else{ //flash error

      return;
  }

});



router.get('/login', AuthenticationFunctions.ensureNotAuthenticated, (req, res) => {
  console.log('bruh')
  return res.render('login.ejs', {
    error: req.flash('error'),
    success: req.flash('success'),
  });
});

router.get('/loginFail', AuthenticationFunctions.ensureNotAuthenticated, (req, res) => {
  return res.send("\"Authentication Fail\"");
});

router.post('/login', AuthenticationFunctions.ensureNotAuthenticated, passport.authenticate('local', {failureFlash: true, failureRedirect: '/loginFail' }), (req, res) => {
   return res.send("\"OK\"");
});





router.get('/register', function(req, res, next) {
    res.render('register.ejs');
  
  });


  router.post('/register', AuthenticationFunctions.ensureNotAuthenticated, (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;
    let email = req.body.email;
    let type = "1"; //1 = student, 0 = instructor
    if(req.body.type === "Instructor"){
      type = "0";
    }
    let school = req.body.school;
    let phone_number = req.body.phone_number
  
    req.checkBody('username', 'Username field is required.').notEmpty();
    req.checkBody('password', 'New Password field is required.').notEmpty();
    //req.checkBody('repassword', 'Confirm New password field is required.').notEmpty();
    //req.checkBody('repassword', 'New password does not match confirmation password field.').equals(req.body.password);
  
    let formErrors = req.validationErrors();
    if (formErrors) {
      req.flash('error', formErrors[0].msg);
      return res.redirect('/register');
    }
  
    let con = mysql.createConnection(dbInfo);
    con.query(`SELECT * FROM user WHERE username=${mysql.escape(req.body.username)};`, (error, results, fields) => { //checks to see if username is already taken
      if (error) {
        console.log(error.stack);
        con.end();
        return res.send();
      }
  
      if (results.length == 0) {
        let userid = uuid.v4();
        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(password, salt);
        con.query(`INSERT INTO user (id, type, username, password, name, email, phone_number, school, class_list) VALUES (${mysql.escape(userid)}, ${mysql.escape(type)}, ${mysql.escape(username)}, ${mysql.escape(hashedPassword)}, ${mysql.escape(name)}, ${mysql.escape(email)}, ${mysql.escape(phone_number)},${mysql.escape(school)}, ${mysql.escape('[]')});`, (error, results, fields) =>  {
          if (error) {
            console.log(error.stack);
            con.end();
            return;
          }
          if (results) {
           // console.log(`${req.body.email} successfully registered.`);
            con.end();
            req.flash('success', 'Successfully registered. You may now login.');
            //return res.redirect('/login');
            return res.send("\"OK\"");
          }
          else {
            con.end();
            req.flash('error', 'Something Went Wrong. Try Registering Again.');
            return res.redirect('/register');
          }
  
  
        });
      }
      else {
        con.end();
        req.flash('error', 'Username is already taken');
        return res.redirect('/register');
  
      }
  
  
    }); //initial query
  
  
  });
  

router.get('/logout', AuthenticationFunctions.ensureAuthenticated, (req, res) => {
  console.log(req.user)
  req.logout();
  req.session.destroy();
  //return res.redirect('/login');
  return res.send("\"OK\"");
});

router.post('/reqestClass', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
  console.log("VERY COOL", req.query);
  await addStudentToClass(req,res);
  let results = await addStudentRequest(req, res);
  //let results2 = await addStudentToClass(req, res);

  if (results) {

      req.flash('success', 'Successfully updated.');
      return res.send("\"OK\"");
    
  }
  else {
      req.flash('error', 'Something Went Wrong. Try Again.');
      return res.redirect('/login');
  }
});

router.get('/requests', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
  let results = await getStudentRequests(req, res);
  if (results) {
    req.flash('success', 'Successfully updated.');
    return res.send({status: "OK", results});
  }
  else {
    req.flash('error', 'Something Went Wrong. Try Again.');
    return res.send({status: "ERROR"});;
}
});

router.put('/confidence', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
  let results = await updateConfidence(req, res);
  
  if (results) {
      req.flash('success', 'Successfully updated confidence.');
      console.log("IN RESULTS");
      return res.status(200).send(results);
  } else {
      req.flash('error', 'Something went wrong. Try again.');
      console.log("IN NO RESULTS");
      return res.status(400).send(results);//json({status:400, message: "error"});
  }
});


router.get('/confidence', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
  let results = await getConfidence(req, res);
  console.log('\n\n\nresults:', results,'\n\n\n')
  if (results) {
    
      return res.status(200).send(results);
  } else {
      return res.status(400).send(results);//json({status:400, message: "error"});
  }
});

router.get('/avgconfidence', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
  let results = await getAvgConfidence(req, res);
  console.log(results);
  if (results) {
      return res.status(200).send({Average: results});
  } else {
      return res.status(400).send({Average: results});//json({status:400, message: "error"});
  }
});

router.put('/reset-email', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
  //console.log('body',req.user)
  let results = await resetEmail(req, res);
  // console.log(results)
  if (results) {
    console.log(`${req.body.newEmail} successfully registered.`);
    req.flash('success', 'Successfully updated.');
    res.send("\"OK\"");
    return;
  }
  else {
      req.flash('error', 'Something Went Wrong. Try Again.');
      return res.redirect('/');
  }
  return;
});


router.post('/getLectureVideoLink', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
  let lectureId = req.body.lectureId;
  let con = mysql.createConnection(dbInfo);
  con.query(`SELECT video_link FROM lecture WHERE id=${mysql.escape(lectureId)};`, (error, results, fields) => {
    if (error) {
      console.log(error.stack);
    }
    else{
      let video_link = results[0].video_link;
      console.log("Video Link: " + results[0].video_link);
      res.send("{\"lectureVideoLink\":\""+ video_link + "\"}");
    }
    con.end();
    
    return;
});

});



router.post('/changePassword', AuthenticationFunctions.ensureAuthenticated, (req, res) => {
  let currentPassword = req.body.currentPassword;
  let newPassword = req.body.newPassword;
  let reNewPassword = req.body.reNewPassword;
  let userId = req.user.id;

  if (bcrypt.compareSync(currentPassword, req.user.password)) { // compare current password
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(newPassword, salt);
    let con = mysql.createConnection(dbInfo);
    con.query(`UPDATE user SET password = ${mysql.escape(hashedPassword)} WHERE id=${mysql.escape(userId)};`, (error, results, fields) => {
      if (error) {
        console.log(error.stack);
      }
      con.end();
      res.send("\"OK\"");
      return;
  });
}
  else{ //flash error

      return;
  }

});

//new question (student view)
router.post('/postQuestionStudent', AuthenticationFunctions.ensureAuthenticated, (req, res) => {
  let question = req.body.question;
  let studentName = req.user.name;
  let lectureId = req.body.lectureId;
  let questionId = uuid.v4();
  let timestamp = req.body.timestamp;
  let formattedTimestamp = req.body.formattedTimestamp;

  let con = mysql.createConnection(dbInfo);
     con.query(`INSERT INTO question VALUES(${mysql.escape(questionId)},${mysql.escape(lectureId)},${mysql.escape(studentName)},${mysql.escape(question)},${mysql.escape('')},${mysql.escape(0)},${mysql.escape(timestamp)},${mysql.escape(formattedTimestamp)});`, (error, results, fields) => {
      if (error) {
        console.log(error.stack);
      }
      con.end();
      res.send("\"OK\"");
      return;
  });


});


//get questions (Student view)
router.post('/getQuestionsStudent', AuthenticationFunctions.ensureAuthenticated, (req, res) => {
  let lectureId = req.body.lectureId;
  let con = mysql.createConnection(dbInfo);
     con.query(`SELECT * FROM question WHERE lectureId=(${mysql.escape(lectureId)}) ORDER BY timestamp DESC;`, (error, results, fields) => {
      if (error) {
        console.log(error.stack);
      }
      //console.log(results)
      
      // results.forEach(result => console.log(result));

      con.end();
      res.send(results);
      return;
  });


});




router.post('/messages', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
  let results = await postMessage(req, res);
  console.log('\n\n\nresults:', results,'\n\n\n')
  if (results) {

      return res.status(200).send(results);
  } else {
      return res.status(400).send(results);//json({status:400, message: "error"});
  }
});
router.get('/messages', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
  let results = await getMessages(req, res);
  console.log('\n\n\nresults:', results,'\n\n\n')
  if (results) {
    
      return res.status(200).send(results);
  } else {
      return res.status(400).send(results);//json({status:400, message: "error"});
  }
});
router.get('/classmessage', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
  let results = await getMessagesByClass(req, res);
  console.log('\n\n\nresults:', results,'\n\n\n')
  if (results) {
    
      return res.status(200).send(results);
  } else {
      return res.status(400).send(results);//json({status:400, message: "error"});
  }
});
router.get('/notifications', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
  let results = await getNotifications(req, res);
  console.log('\n\n\nresults:', results,'\n\n\n')
  if (results) {
    
      return res.status(200).send(results);
  } else {
      return res.status(400).send(results);//json({status:400, message: "error"});
  }
});
router.get('/classnotifications', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
  let results = await getNotificationsByClass(req, res);
  console.log('\n\n\nresults:', results,'\n\n\n')
  if (results) {
    
      return res.status(200).send(results);
  } else {
      return res.status(400).send(results);//json({status:400, message: "error"});
  }
});
router.put('/clearnotifications', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
  let results = await clearNotifications(req, res);
  console.log('\n\n\nresults:', results,'\n\n\n')
  if (results) {
    
      return res.status(200).send(results);
  } else {
      return res.status(400).send(results);//json({status:400, message: "error"});
  }
});
router.put('/clearclassnotifications', AuthenticationFunctions.ensureAuthenticated, async function(req, res, next) {
  let results = await clearNotificationsByClass(req, res);
  console.log('\n\n\nresults:', results,'\n\n\n')
  if (results) {
    
      return res.status(200).send(results);
  } else {
      return res.status(400).send(results);//json({status:400, message: "error"});
  }
});







module.exports = router;
