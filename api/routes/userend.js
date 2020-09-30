var express = require('express');
var router = express.Router();
var passport = require("passport");
const flash = require('connect-flash');
const uuidv4 = require('uuid');
const mysql = require("mysql");
const bcrypt = require('bcrypt');

//for passport
const LocalStrategy = require('passport-local').Strategy;
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


router.get('/', AuthenticationFunctions.ensureAuthenticated,function(req, res, next) {
    res.render('index.ejs', { name: req.user.name });
  });

passport.use(new LocalStrategy({ passReqToCallback: true, },
  function (req, username, password, done) {
    let con = mysql.createConnection(dbInfo);
    con.query(`SELECT * FROM student WHERE username=${mysql.escape(username)};`, (error, results, fields) => {
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
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;
    let email = req.body.email;
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
    con.query(`SELECT * FROM student WHERE username=${mysql.escape(req.body.username)};`, (error, results, fields) => { //checks to see if username is already taken
      if (error) {
        console.log(error.stack);
        con.end();
        return res.send();
      }
  
      if (results.length == 0) {
        let userid = 45;//uuidv4();
        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(password, salt);
        con.query(`INSERT INTO student ( username, password, name, email, phone_number, class_list) VALUES (${mysql.escape(username)}, ${mysql.escape(hashedPassword)}, ${mysql.escape(name)}, ${mysql.escape(email)}, ${mysql.escape(phone_number)}, ${mysql.escape('["1"]')} );`, (error, results, fields) =>  {
          if (error) {
            console.log(error.stack);
            con.end();
            return;
          }
          if (results) {
            console.log(`${req.body.email} successfully registered.`);
            con.end();
            req.flash('success', 'Successfully registered. You may now login.');
            return res.redirect('/login');
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

module.exports = router;