
// dependencies
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
// If deployed, use the deployed database on heroku's mongolab. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// initialize express
var app = express();

// config db
var databaseUrl = "sifterDB";
var collections = ["articles"];


// /all route
// using  mongojs to hook db of the db var
var db = mongojs(databaseUrl,collections);

app.get("/all", function(req,res){
    db.scrapedData.find({}, function(err, data) {
      
      if (err) {
        console.log(err);
      }
      else {
        res.json(data);
      }
    });
  })

// scraper route
app.get("/scrapedData", function (req, res){
    axios.get("https://medium.com/topic/technology").then(function(response) {
  
      var $ = cheerio.load(response.data);
    
      // An empty array to save the data that we'll scrape
      var results = [];
  
      $("h3.ai").each(function(i, element) {
    
        var title = $(element).children().text();
        var link = $(element).children().attr("href")
  
       
        db.scrapedData.insert({"title":title, "link":link })
      });
      console.log(results);
  
    });
    res.send("websiteScraped")
  })