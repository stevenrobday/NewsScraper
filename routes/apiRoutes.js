//dependencies
var cheerio = require("cheerio");
var request = require("request");
var db = require("../models");

module.exports = function (app) {
  //scrape articles
  app.post("/api/scrape", function (req, res) {
    request("http://www.kotaku.com", function (error, response, html) {
      if (error) return res.json(error);

      //load returned html into $ variable
      var $ = cheerio.load(html);
  
      //each article on kotaku is wrapped around a div with
      //class of post-wrapper. loop thru these
      $("div.post-wrapper").each(function (i, element) {
  
        //make result object
        var result = {};
  
        //pass in headline, link and summary
        result.title = $(element).find("h1.headline").text();
        result.link = $(element).find("a").attr("href");
        result.summary = $(element).find("div.excerpt p").text();
  
        //if article has a title, put it in the database
        if (result.title) {
          //update is used here in case there's duplicate titles
          //if title already exists, it just updates with the new result
          //if inserted, bookmarked is set to false
          db.Article.update(result, result, { new: true, upsert: true, setDefaultsOnInsert: true })
            .then(function (dbArticle) {
              //send response
              res.json(dbArticle);
            })
            .catch(function (err) {
              return res.end(err);
            });
        }
      });
    });
  });
  
  //delete all articles and bookmarks
  app.delete("/api/clear", function (req, res) {
    db.Article.remove({})
      .then(function(data){
        return db.Comment.remove({})
      })
      .then(function(data2){
        res.json(data2);
      })
      .catch(function (err) {
        return res.json(err);
      });
  });
  
  //clear all bookmarks
  app.put("/api/clear_bookmarks", function (req, res) {
    //multi set to true in case more than one bookmark needs to be cleared
    db.Article.update({}, { bookmarked: false }, {multi: true})
      .then(function(data){
        res.json(data);
      })
      .catch(function (err) {
        return res.json(err);
      });
  });

  //update bookmarked field in Article collection
  app.put("/api/bookmark/:id/:bool", function (req, res) {
    db.Article.update({ _id: req.params.id }, { $set: { bookmarked: req.params.bool } })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        return res.json(err);
      });
  });
  
  //get comments for a particular article. returns an article with all comments populated
  app.get("/api/comments/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("comments")
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
  });
  
  //post a comment
  app.post("/api/comment/:id", function (req, res) {
    db.Comment.create(req.body)
      .then(function (dbComment) {
        //push new comment into comments array
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: dbComment._id } });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });
  
  //delete a comment
  app.delete("/api/delete_comment/:article_id/:comment_id", function (req, res) {
    //delete comment from Comment collection
    db.Comment.deleteOne({ _id: req.params.comment_id })
      .then(function (dbComment) {
        //then remove from comment array for that Article
        return db.Article.findByIdAndUpdate(req.params.article_id, { $pullAll: { comments: [req.params.comment_id] } });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });
};