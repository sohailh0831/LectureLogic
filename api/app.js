var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require("cors")
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require('./routes/testAPI');
var authRouter = require('./routes/userend');
const dotenv = require('dotenv')
var expressValidator = require('express-validator');
var nickTestRouter = require('./routes/nickTestAPI.js')

dotenv.config();

var app = express();
app.use(expressValidator());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
//app.use(cors());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//setting up passport
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
var passport = require("passport");
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Express Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}));

app.use(flash());

// Passport init
app.use(passport.initialize());
app.use(passport.session());



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/testAPI',testAPIRouter);
app.use('/',authRouter);
app.use('/nick', nickTestRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
