const express = require('express');
const router = express();
const pool = require('../config/database');


router.post('/search', (req, res) => {                                                          //
                                                                                                    
    //Get pagination number.   
    console.log(req.body)    
    const {SearchInput} = req.body;                                                                  //                                             
    console.log(SearchInput)                                                        

    pool.getConnection((err, conn)=> {
        if(err) {
            console.log(err);                                                                       //
            throw err;
        }      
    var insert = ['user_post', 'title'];                                                                 
    var sqlQuery = `SELECT * FROM ?? WHERE ?? LIKE '%${SearchInput}%'`; 
        
        conn.query(sqlQuery, insert,  (err, matchedPosts) => {
            if(err){
                console.log(err);
                throw err;
            }

        //Get jwt token from the cookie.
        const token = req.cookies.jwttoken;
        const user  = JSON.parse(token);
        //Data to be sent to the edit.EJS.
         const data = {
             SearchInput,
             matchedPosts,
             user
         }
         console.log(data)
         res.render('search', {data:data})
        })

    })  

})                   

module.exports = router;