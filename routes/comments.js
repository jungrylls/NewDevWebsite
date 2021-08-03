const express = require('express');
const router = express.Router();
const pool = require('../config/database');


router.get('/comments', (req, res) => {
    var commentId = req.query.comment_Id;
    console.log(commentId);

    pool.getConnection((err, conn) => {
        if(err){
            console.log(err);
        }
        var sqlQuery = `SELECT * FROM ?? WHERE ??=?`
        var insert = ['comment', 'comment_id', commentId];

        conn.query(sqlQuery, insert, (err, rows)=> {
            if(err){
                console.log(err);
            }
            res.send({rows});
            
        })
    })
})

router.post('/comments', (req, res) => {
    var data = req.body;
    var {userComment, postId} = req.body;

    var today = new Date();                                                             //
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();        //
    var dateTime = date; 
    const token = req.cookies.jwttoken;
    const user  = JSON.parse(token);


    var tableData = {
        post_id : req.body.postId,
        user_comment : req.body.userComment,
        user_name: user.profile.name,                                                              //
        date: dateTime,
        user_email: user.profile.email
    }

    pool.getConnection((err, conn) => {
        if(err){
            console.log(err);
        }
        var sqlQuery = `INSERT INTO comment SET ?`;
        conn.query(sqlQuery, tableData, (err, rows)=> {
            if(err){
                console.log(err)
                throw err;
            }
            conn.release();
            res.status(200).send({rows})
        })
    })
})

router.patch('/comments/edit', (req, res) => {
    
    var {newComm, commId} = req.body
    console.log(commId)
    var insert = ['comment','user_comment', newComm, 'comment_id', commId];
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
            res.status(200).send({rows});
        })
    })

    console.log(newComm + commId);
})


router.delete('/comments/delete', (req, res) => {
    const {id} = req.body;
    var insert = ['comment', 'comment_id', id];
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
            res.status(200).send({rows});
        })
    })
})

module.exports = router;