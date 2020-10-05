var express = require('express');
var router = express.Router();
var passport = require("passport");
const flash = require('connect-flash');
const uuid = require('uuid');
const mysql = require("mysql");
const bcrypt = require('bcrypt');

//for passport
const LocalStrategy = require('passport-local').Strategy;
const AuthenticationFunctions = require('../Authentication.js');

import {
  resetEmail,
} from '../store/reset';

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
            name: results[0].name
          };
          con.end();
          return done(null, user);
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



router.get('/login', AuthenticationFunctions.ensureNotAuthenticated, (req, res) => {
  return res.render('login.ejs', {
    error: req.flash('error'),
    success: req.flash('success'),
  });
});


router.post('/login', AuthenticationFunctions.ensureNotAuthenticated, passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }), (req, res) => {
  res.redirect('/dashboard');
});


router.get('/register', function(req, res, next) {
    res.render('register.ejs');
  
  });


  router.post('/register', AuthenticationFunctions.ensureNotAuthenticated, (req, res) => {
    console.log(req.body.username);
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
            console.log(`${req.body.email} successfully registered.`);
            con.end();
            req.flash('success', 'Successfully registered. You may now login.');
            //return res.redirect('/login');
            return res.send("[\"OK\"]");
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
  req.logout();
  req.session.destroy();
  return res.redirect('/login');
});

router.put('/reset-email', AuthenticationFunctions.ensureAuthenticated, (req, res) => {
  let results = resetEmail(req, res);
  if (results) {
    console.log(`${req.body.newEmail} successfully registered.`);
    req.flash('success', 'Successfully updated.');
    return res.redirect('/login');
  }
  else {
      req.flash('error', 'Something Went Wrong. Try Again.');
      return res.redirect('/register');
  }
  return;
});

module.exports = router;
