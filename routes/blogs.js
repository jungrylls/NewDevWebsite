const { Router, response } = require('express');
const express = require('express');
const router = express();
const pool = require('../config/database');

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓  LIST OF POSTS ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
router.get('/posts/:page', (req, res) => {                                                          //
                                                                                                    
    //Get pagination number.                                                                        //
    const page = req.params.page;                                                                   
    //Get offset value for mySQL pagination query.                                                  //
    const offSet = (page * 5) - 5;                                                                  

    //Get a db pool connection.                                                                     //
    pool.getConnection((err, conn) => {
        //Handle error from db pool connection.                                                     //
        if(err) {
            console.log(err);                                                                       //
            throw err;
        }                                                                                           //

        //mySQL query to retrieve posts from "user_post" table, for appropriate page number.        //
        conn.query(`SELECT * from user_post LIMIT ${offSet}, 5`, (err, rows, fields) => {
            //Handle error from mySQL query.                                                        //
            if(err){
                console.log(err);                                                                   //
                throw err;
            }                                                                                       //
           
            //mySQL query to retrieve total number of post counts from "user_post" talbe.           //
            conn.query("SELECT count(*) as count FROM user_post", (err, numbOfRows) => {
                //Get jwt Token from Cookie.                                                        //
                const token = req.cookies.jwttoken;
                const user  = JSON.parse(token);                                                    //

                //Get total number of posts in the data table.                                      //
                const numb = JSON.parse(JSON.stringify(numbOfRows))
                                                                                                    //
                //Data to be passed to EJS.
                const data = {                                                                      //
                    rows,
                    numb,                                                                           //
                    user
                }                                                                                   //
                //Release the pool connection.
                conn.release();                                                                     //

                //Render posts EJS.                                                                 //
                res.render('posts', {data: data});
            })                                                                                      //
        })
    })                                                                                              //
    /*
    If a single connection instead of the pool is needed, then use below code.                      //
    mysqlConnection.query("SELECT * from user_post", (err, rows, fields) => {
        if(err){                                                                                    //
            console.log(err);
        }else{                                                                                      //
            obj = JSON.parse(JSON.stringify(rows));
            //console.log(obj);                                                                     //
            res.render('posts', obj);
        }                                                                                           //
    })
    */                                                                                              //

})                                                                                                  //
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑


//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓  CREATE A NEW POST ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
                                                                                                    //
//Get submit route
router.get('/submit', (req, res) => {                                                               //
    //Get jwt token from cookie.
    const token = req.cookies.jwttoken;                                                             //
    const user  = JSON.parse(token);
    //Data to be sent to EJS.                                                                       //
        const data = {
            user                                                                                    //
        }
    //Render submit.EJS                                                                             //
    res.render('submit', {data: data});                                                                                                  
})                                                                                                  //
                                    
//Post submit route to insert new data into db.                                                     //
router.post('/posts', (req, res) => {                                                   
                                                                                                    //
    //Get current date.
    var today = new Date();                                                                         //
    //Parse today into YEAR-MONTH-DATE                                                          
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();                    //
    var dateTime = date; 
    //Get jwt token from cookie.                                                                    //
    const token = req.cookies.jwttoken;
    const user  = JSON.parse(token);                                                                //

    //Get title and content from submit.EJS.                                                        //
    const {title, content} = req.body;           
                                                                                                    //
    //Data to be inserted into the "user_post" table.
    var tableData = {                                                                               //
        post: content,                                                                  
        title: title,                                                                               //
        user_name: user.profile.name,                                                              
        date: dateTime,                                                                             //
        email: user.profile.email                                                                  
    }                                                                                               //
    //Get a db pool connection.
    pool.getConnection((err, conn) => {                                                             //
        if(err){
            console.log(err);                                                                       //
            throw err;
        }                                                                                           //
        //mySQL query to insert a value into "user_post".
        var sqlQuery = `INSERT INTO user_post SET ?`;                                               //
        conn.query(sqlQuery, tableData, (err, rows, fields) => {
            if(err){                                                                                //
                console.log(err)
                throw err;                                                                          //
            }
            //Release the pool connection.                                                          //
            conn.release();
            //Redirect to the first page of the blog list.                                          //
            res.redirect('/posts/1')
        })                                                                                          //
    })                                
    /*If a single connection instead of the pool is needed, then use below code.                    //
    mysqlConnection.query(sqlQuery, tableData, (err, rows) => {                         
        if(err){                                                                                    //
            console.log(err);                                                           
        }else{                                                                                      //
            res.redirect('/posts');                                                     
        }                                                                                           //
    })            
     */                                                                                             //                            
})                                                                                                  //
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑


//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓  SHOW ONE POST↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓  
//Show route to show one specific post. "id" parameter sent from list of posts.             
router.get('/post/:id', (req, res) => {                                                 
    //Get "id" parameter value.                                                           
    const postId = req.params.id;
    //Get jwt token from cookie.
    const token = req.cookies.jwttoken;
    const user  = JSON.parse(token); 
    
    //FIRST: mySQL query to find one specific post from "user_post" table with matching "id".
    var insert = ['user_post', 'id', postId];                                                                 
    var sqlQuery = `SELECT * FROM ?? WHERE ??= ?`; 

    //SECOND: mySQL query to find all posts from "user_post" table with a matching author "email".
    var insert2 = ['user_post', 'email', user.profile.email];  
    var sqlQuery2 = `SELECT * FROM ?? WHERE ??= ?`;

    //THIRD: mySQL query to find all comments from "comment" table with a matching "post_id".
    var insert3 = ['comment', 'post_id', postId];
    var sqlQuery3 = `SELECT * FROM ?? WHERE ??= ?`;

    //Get a db pool connection.
    pool.getConnection((err, conn) => {
        if(err){
            console.log(err);
            throw err;
        }
        //FIRST mySQL query.
        conn.query(sqlQuery, insert, (err, userPost) => {
            if(err){
                console.log(err);
                throw err;
            }
            
            //SECOND mySQL query.
            conn.query(sqlQuery2, insert2, (err, userPosts) => {
                if(err){
                    console.log(err);
                    throw err;
                }

                //THIRD mySQL query.
                conn.query(sqlQuery3, insert3, (err, matchingComments) => {
                    if(err){
                        console.log(err)
                        throw err;
                    }

                    //Check if the current user is the author of the current post.
                    let postOwner = isUserOwn(userPost, userPosts);

                    //Data to be sent to show.EJS.
                    const data = {
                        userPost,
                        user,
                        postOwner,
                        matchingComments
                    }
                    //Release the pool connection.
                    conn.release();
                    //Render the show.EJS.
                    res.render('show', {data:data})

                })

            })
        })
    })
    /*If a single connection instead of the pool is needed, then use below code.
    mysqlConnection.query(sqlQuery, insert, (err, rows) => {                                     
        if(err){                                                                        
            console.log(err);                                                            
        }else{                                                                           
            obj = JSON.parse(JSON.stringify(rows));                                      
            res.render('show', obj);                                                     
        }                                                                                
    })             
    */                                                                      
})                                                                                       
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

//Function that checks if a current user owns the current post.
function isUserOwn(objA, objB){
    for(let i=0; i<objB.length; i++){
        if(objA[0].email === objB[i].email){
            return true;
        }
    }
    return false;
}

/*RowDataPacket {
    id: 1,
    post: '        hello there this is a new post that I made from my computer. This post is good post.\r\n' +
      '    ffffffffffffffffffffffffffffffffffffffffffff',
    url: 'www.google.com',
    title: 'The New Post',
    user_name: 'Rengar Kim',
    date: '2021-07-20',
    user_point: 0,
    email: null
  }*/
  
//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓  EDIT ONE POST↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
router.get('/posts/:id/edit', (req, res) => { 
    //Get "id" parameter value.                                          //
    const userId = req.params.id;
    //mySQL query to find one post from "user_post" tabke with a matching id.
    var insert = ['user_post', 'id', userId];                                                       //
    var sqlQuery = `SELECT * FROM ?? WHERE ??= ?`;

    //Get a db pool connection.
    pool.getConnection((err, conn) => {
        if(err){
            console.log(err);
            throw err;
        }

        //mySQL query to find one post from "user_post" tabke with a matching id.
        conn.query(sqlQuery, insert, (err, rows) => {
            if(err){
                console.log(err);
                throw err;
            }
            //Release the databse pool connection.
            conn.release();
            //Get jwt token from the cookie.
            const token = req.cookies.jwttoken;
            const user  = JSON.parse(token);
            //Data to be sent to the edit.EJS.
            const data = {
                rows,
                user
            }
            //Render the edit.EJS.
            res.render('edit', {data:data});
        })
    })                  
    /*If a single connection instead of the pool is needed, then use below code.      
    mysqlConnection.query(sqlQuery, insert, (err, rows) => {                                    
        if(err){                                                                        
            console.log(err);                                                           
        }else{                                                                          
            obj = JSON.parse(JSON.stringify(rows));                                     
            res.render('edit', obj);                                                    
        }                                                                               
    })             
    */                                                  
})                                                                                      

//Edit post route.
router.patch('/posts/:id', (req, res) => {   
    //Get "id" parameter value.                                                                                   
    const userId = req.params.id;
    //Get modified post from the edit.EJS form.
    const editedContent = req.body.edit_content;

    //mySQL query to update a post content from the "user_post" table with a matching id.
    var insert = ['user_post','post', editedContent, 'id', userId];
    var sqlQuery = `UPDATE ?? SET ??=? WHERE ??=?`; 
    pool.getConnection((err, conn) => {
        if(err){
            console.log(err);
            throw err;
        }
        conn.query(sqlQuery, insert, (err, rows)=> {
            if(err){
                console.log(err)
                throw err
            }
            conn.release();
            //Redirect to POSTS
            res.redirect('/posts/1');
        })
    })
    /*If a single connection instead of the pool is needed, then use below code. 
    mysqlConnection.query(sqlQuery, insert, (err, rows) => {
        if(err){                                                                        
            console.log(err);
        }else{                                                                          
            res.redirect('/posts/1');
        }                                                                               
    })
    */                                                                        
})                                                                                                            
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑


router.delete('/posts/:id', (req, res) => {
    const id = req.params.id;
    var insert = ['user_post', 'id', id];
    var sqlQuery = `DELETE FROM ?? WHERE ??=?`;

    pool.getConnection((err, conn) => {
        if(err){
            console.log(err);
            throw err;
        }
        conn.query(sqlQuery, insert, (err, rows)=> {
            if(err){
                console.log(err)
                throw err
            }
            conn.release();
            res.redirect('/posts');
        })
    })

    // mysqlConnection.query(sqlQuery, insert, (err, rows) => {
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.redirect('/posts');
    //     }
    // })
})

module.exports = router;