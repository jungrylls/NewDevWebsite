var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
  host            : process.env.HOST,
  user            : process.env.USER,
  password        : 'acAC12!@',
  database        : 'posts',
  port: '3306',
  multipleStatements: true
});

pool.getConnection((err, connection) => {
    if(err){
        console.log(err)
    }else{
        console.log("connected to the pool !")
    }
})

module.exports = pool; 