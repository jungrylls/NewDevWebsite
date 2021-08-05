const express = require('express');
const router = express.Router();

//Get Home page.
router.get('/', (req, res) => {
    
    //Get JWT token from the webbrowser cookie.
    const token = req.cookies.jwttoken;

    //If no valid JWT token, then data auth is false.
    if(token === undefined){
        const data = {
            user : {
                auth: false
            }
        }
        //Render home page with false data.
        res.render('home', {data:data})
    }
    
    //If valid JWT token, then data auth is true.
    else{
        const user  = JSON.parse(token);
        const data = {
            user
        }

        //Render homepage with user data.
        res.render('home', {data: data})    
    }
})

//Export module.
module.exports = router;