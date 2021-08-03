var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'password',
  database        : 'posts',
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