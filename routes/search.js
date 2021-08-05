const express = require('express');
const router = express();
const pool = require('../config/database');


router.get('/search/:page', (req, res) => {                                                          //
                                                                                                    
    //Get pagination number.                                                                        //
    const page = req.params.page;                                                                   
    //Get offset value for mySQL pagination query.                                                  //
    const offSet = (page * 5) - 5;     

    console.log(req.query)    
    const SearchInput = req.query.SearchInput;                                                                  //                                             
    console.log(SearchInput)                                                        

    pool.getConnection((err, conn)=> {
        if(err) {
            console.log(err);                                                                       //
            throw err;
        }      
    var insert = ['user_post', 'title'];                                                                 
    var sqlQuery = `SELECT * FROM ?? WHERE ?? LIKE '%${SearchInput}%' LIMIT ${offSet}, 5`; 

    var insert2 = ['user_post', 'title'];
    var sqlQuery2 = `SELECT count(*) as count FROM ?? WHERE ?? LIKE '%${SearchInput}%'`;
        
        conn.query(sqlQuery, insert,  (err, matchedPosts) => {
            if(err){
                console.log(err);
                throw err;
            }

            conn.query(sqlQuery2, insert2, (err, numbOfRows) => {
                if(err){
                    console.log(err);
                    throw err;
                }

                const numb = JSON.parse(JSON.stringify(numbOfRows))

                console.log("the number of matched posts" + numb)
                 //Get jwt token from the cookie.
                const token = req.cookies.jwttoken;
                const user  = JSON.parse(token);
                //Data to be sent to the edit.EJS.
                 const data = {
                     SearchInput,
                     matchedPosts,
                     user,
                     numb,
                     page
                 }
                console.log(data)
                 res.render('search', {data:data})

            })
        })

    })  

})          


router.get('/search/:page/:searched', (req, res) => {                                                          //
                                                                                                    
    //Get pagination number.                                                                        //
    const page = req.params.page;                                                                   
    //Get offset value for mySQL pagination query.                                                  //
    const offSet = (page * 5) - 5;     

    console.log(req.query)    
    const SearchInput = req.params.searched;                                                                  //                                             
    console.log(SearchInput)                                                        

    pool.getConnection((err, conn)=> {
        if(err) {
            console.log(err);                                                                       //
            throw err;
        }      
    var insert = ['user_post', 'title'];                                                                 
    var sqlQuery = `SELECT * FROM ?? WHERE ?? LIKE '%${SearchInput}%' LIMIT ${offSet}, 5`; 

    var insert2 = ['user_post', 'title'];
    var sqlQuery2 = `SELECT count(*) as count FROM ?? WHERE ?? LIKE '%${SearchInput}%'`;
        
        conn.query(sqlQuery, insert,  (err, matchedPosts) => {
            if(err){
                console.log(err);
                throw err;
            }

            conn.query(sqlQuery2, insert2, (err, numbOfRows) => {
                if(err){
                    console.log(err);
                    throw err;
                }

                const numb = JSON.parse(JSON.stringify(numbOfRows))

                console.log("the number of matched posts" + numb)
                 //Get jwt token from the cookie.
                const token = req.cookies.jwttoken;
                const user  = JSON.parse(token);
                //Data to be sent to the edit.EJS.
                 const data = {
                     SearchInput,
                     matchedPosts,
                     user,
                     numb,
                     page
                 }
                console.log(data)
                 res.render('search', {data:data})

            })
        })

    })  

})                   

module.exports = router;