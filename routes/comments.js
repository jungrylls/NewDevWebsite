const express = require('express');
const router = express.Router();
const pool = require('../config/database');

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ AJAX GET COMMENTS ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
router.get('/comments', (req, res) => {                                                                 //
    
    //Get comment ID that was just created.                                                             //
    var commentId = req.query.comment_Id;
                                                                                                        //
    //Get a db pool connection.
    pool.getConnection((err, conn) => {                                                                 //
        if(err){
            console.log(err);                                                                           //
        }
        //mySQL query to select a comment that was just created.                                        //
        var sqlQuery = `SELECT * FROM ?? WHERE ??=?`
        var insert = ['comment', 'comment_id', commentId];                                              //

        conn.query(sqlQuery, insert, (err, rows)=> {                                                    //
            if(err){
                console.log("Selecting new comment with its ID failed from comments.js AJAX GET COMMENTS.Below shows the err obj ↓.")
                console.log(err);                                                                       //
                throw err;
            }                                                                                           //

            //AJAX get successful                                                                       //
            res.send({rows});
                                                                                                        //
        })
    })                                                                                                  //
})                                                                                                      //
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑


//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ AJAX  POST NEW COMMENT ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
router.post('/comments', (req, res) => {                                                                //

    //Get current date.                                                                                 //
    var today = new Date();    
    //Parse today into YEAR-MONTH-DATE                                                                  //                                               //
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();        
    var dateTime = date;                                                                                //
    //Get jwt token from cookie.
    const token = req.cookies.jwttoken;                                                                 //
    const user  = JSON.parse(token);
                                                                                                        //
    //Data to be inserted into the "comment" table.
    var tableData = {                                                                                   //
        post_id : req.body.postId,
        user_comment : req.body.userComment,                                                            //
        user_name: user.profile.name,                                                              
        date: dateTime,                                                                                 //
        user_email: user.profile.email
    }                                                                                                   //

    //Get a db pool connection.                                                                         //
    pool.getConnection((err, conn) => {
        if(err){                                                                                       //
            console.log(err);
        }                                                                                               //
        //mySQL query to insert into "comment" table.
        var sqlQuery = `INSERT INTO comment SET ?`;                                                     //
        conn.query(sqlQuery, tableData, (err, rows)=> {
            if(err){
                console.log("Inserting a new comment into comment table failed from comments.js AJAX POST NEW COMMENT. Below shows err obj ↓. ")                                                                                     //
                console.log(err)
                throw err;                                                                              //
            }
            //Release the pool connection                                                               //
            conn.release();
            //Post success.                                                                             //
            res.status(200).send({rows})
        })                                                                                              //
    })
})                                                                                                      //
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑


//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ AJAX  EDIT COMMENT ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
router.patch('/comments/edit', (req, res) => {                                                          //
    
    //Get comment content and commend ID from requst body.                                              //
    var {newComm, commId} = req.body
                                                                                                        //
    //mySQL query to edit a comment that matches the comment ID.
    var insert = ['comment','user_comment', newComm, 'comment_id', commId];                             //
    var sqlQuery = `UPDATE ?? SET ??=? WHERE ??=?`;
                                                                                                        //
    //Get a db pool connection.
    pool.getConnection((err, conn) => {                                                                 //
        if(err){
            console.log(err);                                                                           //
            throw err;
        }                                                                                               //
        //Edit a comment.
        conn.query(sqlQuery, insert, (err, rows)=> {                                                    //
            if(err){
                console.log("Editing a comment with the givne comment ID failed from comments.js AJAX EDIT COMMENT. Below shows the err object ↓.")
                console.log(err)                                                                        //
                throw err
            }                                                                                           //
            //Release the pool connection.
            conn.release();                                                                             //
            //Comment edit successful.
            res.status(200).send({rows});                                                               //
        })
    })                                                                                                  //
})                                                                                                      //
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑  


//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ AJAX  DELETE COMMENT ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
router.delete('/comments/delete', (req, res) => {                                                       //
    
    //Get the comment ID from the body.                                                                 //
    const {id} = req.body;
                                                                                                        //
    //mySQL query to delete a comment with a matching ID.
    var insert = ['comment', 'comment_id', id];                                                         //
    var sqlQuery = `DELETE FROM ?? WHERE ??=?`;
                                                                                                        //
    //Get a db pool connection.
    pool.getConnection((err, conn) => {                                                                 //
        if(err){
            console.log(err);                                                                           //
            throw err;
        }                                                                                               //
        //Delete the comment.
        conn.query(sqlQuery, insert, (err, rows)=> {                                                    //
            if(err){
                console.log("Deleting a comment with a given ID failed from comments.js AJAX DELETE COMMENT. Below shows the err object ↓.");
                console.log(err);                                                                       //
                throw err
            }                                                                                           //
            //Release the pool connection.
            conn.release();                                                                             //
            //Delete successful.
            res.status(200).send({rows});                                                               //
        })
    })                                                                                                  //
})                                                                                                      //
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

//Export the module.
module.exports = router;