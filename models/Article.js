var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//schema for scraped articles
var ArticleSchema = new Schema({
  //headline
  title: {
    type: String,
    required: true
  },
  //link to kotaku page
  link: {
    type: String,
    required: true
  },
  //summary of article
  summary: {
    type: String
  },
  //whether or not bookmarked
  bookmarked: {
    type: Boolean,
    default: false
  },
  //array of id's linked to Comment collection
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

//index title to prevent duplicates
ArticleSchema.index({title: 1}, {unique: true});

//model for Article collection
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;