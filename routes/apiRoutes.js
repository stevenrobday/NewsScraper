var cheerio = require("cheerio");
var request = require("request");
var db = require("../models");


module.exports = function (app) {
  app.post("/api/scrape", function (req, res) {
    request("http://www.kotaku.com", function (error, response, html) {
      if (error) return res.json(error);

      var $ = cheerio.load(html);
  
      $("div.post-wrapper").each(function (i, element) {
  
        var result = {};
  
        result.title = $(element).find("h1.headline").text();
        result.link = $(element).find("a").attr("href");
        result.summary = $(element).find("div.excerpt p").text();
  
        if (result.title) {
          db.Article.update(result, result, { new: true, upsert: true, setDefaultsOnInsert: true })
            .then(function (dbArticle) {
              res.json(dbArticle);
            })
            .catch(function (err) {
              return res.end(err);
            });
        }
      });
    });
  });
  
  app.post("/api/clear", function (req, res) {
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
  
  app.post("/api/clear_bookmarks", function (req, res) {
    db.Article.update({}, { bookmarked: false }, {multi: true})
      .then(function(data){
        res.json(data);
      })
      .catch(function (err) {
        return res.json(err);
      });
  });
  
  app.get("/api/comments/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("comments")
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
  });
  
  app.post("/api/bookmark/:id/:bool", function (req, res) {
    db.Article.update({ _id: req.params.id }, { $set: { bookmarked: req.params.bool } })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        return res.json(err);
      });
  });
  
  app.post("/api/comment/:id", function (req, res) {
    db.Comment.create(req.body)
      .then(function (dbComment) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: dbComment._id } });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });
  
  app.post("/api/delete_comment/:article_id/:comment_id", function (req, res) {
    db.Comment.deleteOne({ _id: req.params.comment_id })
      .then(function (dbComment) {
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