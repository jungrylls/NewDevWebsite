//.env import
require('dotenv').config();
var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
  host            : process.env.HOST,
  user            : process.env.THE_USER,
  password        : process.env.PASSWORD,
  database        : process.env.DATABASE,
  port: '3306',
  multipleStatements: true
});

pool.getConnection((err, connection) => {
    if(err){
        console.log("The user from the .env file is " + process.env.USER)
        console.log("The password from the .env file is " + process.env.PASSWORD)
        console.log(err)
    }else{
        console.log("connected to the pool !")
    }
})

module.exports = pool; 