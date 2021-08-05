//Import jwtwebtoken
let jwt = require('jsonwebtoken');

//Import cookie parser.
const cookieParser = require("cookie-parser");

//import .env
require('dotenv').config();

//Check if the user is logged in
let checkToken = (req, res, next) => {

    //Retrieve the jwt token from the browser cookie.
    const token = req.cookies.jwttoken;

    //If no valid token, then redirect to homepage.
    if (token === undefined) {
        return res.redirect('/');
    }
    //If valid token, then retrieve user data and proceed to next();
    else {
        const obj = JSON.parse(token);
        try {
            const user = jwt.verify(obj.token, process.env.secret);
            req.user = user;
            next();
        } catch (err) {
            return res.redirect('/');

        }
    }

}

//Export module.
module.exports = {
    checkToken: checkToken
}