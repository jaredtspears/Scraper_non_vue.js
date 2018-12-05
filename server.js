
// dependencies
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");
var db = require("./models");
var exphb = require('express-handlebars')

var path = require('path');

// If deployed, use the deployed database on heroku's mongolab. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articles";
mongoose.connect(MONGODB_URI);

// setting up port 
var PORT = process.env.PORT || 8080;

// initialize express
var app = express();

// joining in directory name and the folder name is views
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphb({defaultLayout: 'main'}));
// setting view engine to handlebars
app.set('view engine', 'handlebars');

// Use morgan logger for logging requests between client and server
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/articles", { useNewUrlParser: true });


// config db
var databaseUrl = "mediumArticlesDB";
var collections = ["articles"];

// this is for the handlebars not sure if I am doing this correctly
//===========================================================
  // joining in directory name and the folder name is views
  // app.set('public', path.join(__dirname, 'public'));
  // app.engine('handlebars', exphb({defaultLayout: 'main'}));
  // // setting view engine to handlebars
  // app.set('view engine', 'handlebars');
//===========================================================

// require routes file. app is the express module being called directly
require("./routes/routes.js")(app);

//==== Start the server ====
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

