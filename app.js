//Import and Create an express application.
const express = require('express');
const { dirname } = require('path');
const app = express();
const hostName = '172.31.19.227';

//Jquery - dom
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);

//Import and Create the default view folder (Where all the EJS files are saved).
const path = require('path');
app.set('views', path.join(__dirname, 'views'));

//Import EJS mate to use boilerplate code to factor out common EJS code.
const ejsMate = require('ejs-mate');
//Set the app engine to EJS.
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

//Specifically made for POST and PUT requests because I am sending data.
//Middleware functions that allow my server to handle incoming data.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//The method-override to use PATCH, UPDATE, DELETE etc.  
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


//Handle Routes.
const homeRoute = require('./routes/home');
const blogRoute = require('./routes/blogs');
const loginRoute = require('./routes/login');
const logoutRoute = require('./routes/logout');
const jwtVerify = require('./middleware/jwt');
const searchRoute = require('./routes/search');
const commentRoute = require('./routes/comments');

//import the database file.
//const mysqlConnection = require('./config/database');
app.use(express.static(path.join(__dirname, 'public')));

//.env import
require('dotenv').config();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Use the routes.
app.use('/', loginRoute);
app.use('/', homeRoute);
app.use('/', jwtVerify.checkToken ,  blogRoute);
app.use('/', jwtVerify.checkToken ,  searchRoute)
app.use('/', logoutRoute);
app.use('/', commentRoute);

//Listen to the port 3306
app.listen(3000, hostName, () => {
    console.log("listening to 3000 !");
})