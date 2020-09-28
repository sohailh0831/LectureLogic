var express = require('express');
var router = express.Router();

var authFunctions = ('./auth.js');

/* GET home page. */
router.get('/jj' ,function(req, res, next) {
  res.render('index.ejs', { name: req.user.name });
});

router.get('/hello',function(req,res,next){
  res.render('index', {title: "Hello"});
})

module.exports = router;
