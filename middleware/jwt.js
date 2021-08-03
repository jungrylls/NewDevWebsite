let jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");



let checkToken = (req, res, next) => {
    const token = req.cookies.jwttoken;

    if (token === undefined) {
        return res.redirect('/');
    } else {
        const obj = JSON.parse(token);
        try {
            const user = jwt.verify(obj.token, process.env.secret);
            req.user = user;
            next();
        } catch (err) {
            //res.clearCookie("jwttoken");
            return res.redirect('/');

        }
    }

}

module.exports = {
    checkToken: checkToken
}