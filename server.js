//dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//middleware
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set static route to public folder for importing assets
app.use(express.static("public"));

//handlebars. default layout is main.handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

//db connection
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.listen(3000, function () {
  console.log("App running on port 3000!");
});