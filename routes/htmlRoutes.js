var db = require("../models");

module.exports = function (app) {
  app.get("/", function (req, res) {
    db.Article.find({})
      .then(function (dbArticle) {
        res.render("index", { comments: false, articles: dbArticle });
      })
      .catch(function (err) {
        return res.json(err);
      });
  });

  app.get("/bookmarks", function (req, res) {
    db.Article.find({ bookmarked: true })
      .populate("comments")
      .then(function (dbArticle) {
        res.render("bookmarks", { comments: true, articles: dbArticle });
      })
      .catch(function (err) {
        return res.json(err);
      });
  });
};