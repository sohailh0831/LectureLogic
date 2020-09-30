var express = require("express");
var router = express.Router();
const dotenv = require('dotenv').config();
//process.env.DB_HOST,
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
  

router.get('/testAPI',function(req,res,next){
    
    let con = mysql.createConnection(dbInfo);
    con.query(`SELECT * FROM student;`, (error, results, fields) => {
      if (error) {
        console.log(error.stack);
        con.end();
        return;
      }
      console.log(results[0]);
      con.end();
      res.send("API is working properly");
    });

});


module.exports = router;