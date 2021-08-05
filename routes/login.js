const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
//Import axios library to fetch SA login
const axios = require('axios').default;
//.env import
require('dotenv').config();
//XML parser
const parseXML = require("xml2js").parseString;

//Route to handle user SamSung login.
router.get('/sa/signin/callback', (req, response) => {

    //Access token initially set undefined.
    var access_token = undefined;

    //User profile initially set undefined.
    var profile = undefined;

    //After initial login, "auth_server_url", "code", and "api_server_url" given.
    const auth_server_url = req.query.auth_server_url;
    const code = req.query.code;
    const api_server_url = req.query.api_server_url;

    //Client ID and secrete was given from the tecace website.
    const client_id = process.env.CLIENTID;
    const client_secret = process.env.CLIENTSECRET;

    //Config object to be passed to the 
    var config = {
        url: `https://${auth_server_url}/auth/oauth2/token`,
        method: 'post',
        params: {
            grant_type: "authorization_code",
            code: code,
            client_id: client_id, 
            client_secret: client_secret 
        },
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    };

   axios(config)
   .then((res) => {
       //console.log(res);
       //console.log(res.data.userId)

       const userId = res.data.userId;
       access_token = res.data.access_token;
       config = {
           method: 'get',
           url: `https://${api_server_url}/v2/profile/user/user/${userId}`,
           headers: {
            'Authorization': 'Bearer ' + access_token, //Access token provided from above response
            'x-osp-appId': client_id, 
            'x-osp-userId': userId //userId provided from above response
            }
       }
       return axios(config);
   })
   .then((res) => {
       //console.log(res.data);
        extractProfileInfo(res.data, access_token)
        .then((result) => {
            profile = result;
            const token = jwt.sign({id: profile.guid}, process.env.secret , {expiresIn: '1h'}, (err, tok) => {
                if(err){
                    console.log("json error !!");
                    console.log(err);
                    res.clearCookie("jwttoken");
                    response.cookie("jwttoken", {auth: false}, {
                        httpOnly: true
                    })
                }
                var obj = JSON.stringify({
                    auth: true,
                    token: tok,
                    profile: profile
                });
                //res.clearCookie("jwttoken");
                response.cookie("jwttoken", obj, {
                    httpOnly: true,
                    maxAge: 3600 * 1000 //milliseconds 1000 ms = 1 second 
                })
                //console.log(profile);
                //console.dir(profile)
                response.redirect('/');
                //response.render('home', obj);
                //store the token into the cookie. response obj built in cookie method. 
            })
        })
        .catch((err) => {
            console.log(err);
        })

   })
   .catch((err)=> {
       console.dir(err);
   })
   
   //res.render('home', profile);
})


function extractProfileInfo(body, accessToken) {
    return new Promise(function(resolve, reject) {
        parseXML(body, function(err, obj) {
            if(err) {
                console.log("error occured in if statement ! ")
                return reject("parse: " + err);
            } else {
                try {
                    var guid = obj.UserVO.userID[0];
                    var userName = obj.UserVO.userBaseVO[0].userName[0];
                    var nameInfo = obj.UserVO.userBaseVO[0].userBaseIndividualVO[0];
                    var email = "";
                    obj.UserVO.userIdentificationVO.forEach(function(x) {
                        if(x.loginIDTypeCode[0] === "003") {
                            email = x.loginID[0];
                        }
                    });
                    var lname = (nameInfo ? nameInfo.familyName[0] : " ");
                    var fname = (nameInfo ? nameInfo.givenName[0] : " ");
                    var profileImg = "";
                    if (obj.UserVO.userBaseVO[0].photographImageFileURLText) {
                        profileImg = obj.UserVO.userBaseVO[0].photographImageFileURLText[0];
                    }
 
                    var profileJSON = {
                        "guid": guid,
                        "name": userName,
                        "email": email,
                        "token": accessToken,
                        "lastName": (lname || " "),
                        "firstName": (fname || " "),
                        "profileImg": profileImg
                    };
                    return resolve(profileJSON); 
                } catch(ex) {
                    return reject("parse: " + ex);
                }
            }
        });
    });
}

module.exports = router;