var db = require("../models");

module.exports = function (app) {
  //when user goes to home page
  app.get("/", function (req, res) {
    db.Article.find({})
      .then(function (dbArticle) {
        //render with handlebars object. no comments on homepage
        res.render("index", { comments: false, articles: dbArticle });
      })
      .catch(function (err) {
        return res.json(err);
      });
  });

  //when user goes to bookmarks page
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