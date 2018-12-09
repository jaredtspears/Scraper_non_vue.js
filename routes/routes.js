// dependencies
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

// using  mongojs to hook db of the db var
var db = require('../models');

var app = require('express').Router();

module.exports =(app) => {
// ====home page route====
app.get('/', (req,res) => {
    // finding all articles
    db.Article.find({})
      .sort({timestamp:-1})
      .then((dbArticle) => {
            res.render('articles', {article:dbArticle});
      })
})

// /====all route====
app.get("/all", (req,res)=>{
    db.Article.find({}, (err, data) =>{
      if (err) {
        console.log(err);
      }
      else {
        res.json(data);
      }
    });
  })

 
// ====scraper route====
// scraping technology related articles from medium
app.get("/scrape-n-paste", function (req, res){
    axios.get("https://medium.com/topic/technology").then(function(response) {
  
      var $ = cheerio.load(response.data);
    
      // An empty array to save the data that we'll scrape
      var results = [];
  
    //   this website had a very hard structure to follow for scraping ran out of time (the structure was many abritrary letters deep)
      $("h3 .ai").each(function(i, element) {
        var article= {};
        var title = $(element).children().text();
        var link = $(this).children("a").attr("href");
        // var summary = $(element).ch'i'ldren().attr('href'); //this was something that when we did this in class we didnt need the summary
        // not sure how to set up the summary for the article 
        //var summary = $(this).children();
    
        article.title=title; 
        article.link=link;
        // article.summary=summary; //might not need this

        //pushing object into the results array
        results.push(article);
        // results 
        db.Article.create(article) //this is what worked for another person
        // db.Article.insert({"title":title, "link":link })
        .then(dbArticle =>{
            console.log("\nArticle scraped: ${dbArticle}");
        })
        .catch(err => {
            console.log("\nError while saving to database: ${err}");
          });
    });
      console.log(results);
  
    });
    res.send("Medium Scraped")
  });

// displaying articles that have been archived
  app.get("/articles", (req,res) =>{
    // should relate id var to paramiters for the id
    // var id = req.params.id;

    // db.Articles.findByIdAndUpdate(id, {$set: {saved:false}})
    // .then((dbArticles) =>{
    //     res.json(dbArticles);
    // }) 
    // .catch((err) =>{
    //     res.json(err);
    // })
  });

//   get logged comments
app.get("/article/:id", (req,res) =>{
    var id = req.params.id;

    // this should be the comments that are logged
    db.Article.findById(id)
    .populate("comment")
    .then((dbArticle)=>{
        res.json(dbArticle);
    })
    .catch((err)=>{
        res.json(err);
    })
})

// start and save new comment
app.post("/comment/:id", (req,res) =>{
    var id = req.params.id;

    // these comments need to be tied to the _id of the article
    db.Comment.create(req.body)
    .then((dbComment)=>{
        return db.Article.findOneAndUpdate({
            _id:id
        },
        { 
            $push:{
            comment: dbComment._id
            }
        }, 
        {
            new: true, upsert: true
        });
    })
    .then((dbArticle)=>{
        res.json(dbArticle);
    })
    .catch((err)=>{
        res.json(err);
    })
})
}