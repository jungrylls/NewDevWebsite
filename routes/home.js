const express = require('express');
const router = express.Router();
//const cookieParser = require("cookie-parser");

//import the database file.
//const mysqlConnection = require('../config/database');
//The JSON.parse() method parses a JSON string,
// constructing the JavaScript value or object described by the string.
// An optional reviver function can be provided to perform a transformation on the resulting object before it is returned.
router.get('/', (req, res) => {
    const token = req.cookies.jwttoken;
    if(token === undefined){
        const data = {
            user : {
                auth: false
            }
        }
       
        
        //const obj = JSON.stringify(data);
        res.render('home', {data:data})
    }else{
        const user  = JSON.parse(token);
        const data = {
            user
        }
        res.render('home', {data: data})    
    }
})

module.exports = router;