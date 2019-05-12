// Dependencies
var express = require("express");
//var mongojs = require("mongojs");
var mongoose = require("mongoose");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
//var path = require("path");
// Require all models
var db = require("./models");

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// // Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });

// Connect to the Mongo DB
mongoose.connect("mongodb://<dbuser>:<dbpassword>@ds155616.mlab.com:55616/heroku_zz14tttd", { useNewUrlParser: true });
// Routes
require("./routes/api-routes")(app);
require("./routes/html-routes")(app);

// Listen on port 3000
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});