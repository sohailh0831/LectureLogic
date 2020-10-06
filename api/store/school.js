var express = require('express');
const flash = require('connect-flash');
const uuid = require('uuid');
const { isNull } = require("lodash");
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

function officialSchools(req, res) {
    return new Promise(resolve => {
        let con = mysql.createConnection(dbInfo);
        con.query('select LocationName from official_schools', (error, results, fields) => {
        
        if (error) {
            console.log(error.stack);
            con.end();
            //res.status(400).send(error);
            resolve();
            return;
        }
        console.log(results);
        con.end();
        resolve(results);
        });
    });
}

function instructorSchools(req, res) {
    return new Promise(resolve => {
        let con = mysql.createConnection(dbInfo);
        con.query('select school from user where type = 0', (error, results, fields) => {
            if (error) {
                console.log(error.stack);
                con.end();
                //res.status(400).send(error);
                resolve();
                return;
            }
            console.log(results);
            con.end();
            //res.status(200).send(results);
            resolve(results);
        }); 
    });
}



  module.exports = {officialSchools, instructorSchools}