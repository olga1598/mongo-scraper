var axios = require("axios");
var cheerio = require("cheerio");
//var path = require("path");
var db = require("../models");


module.exports = function (app) {

        // Scrape data from one site and place it into the mongodb db
    app.get("/scrape", function(req, res) {
        // //Remove the data from DB before new scrape
        // db.Article.remove(
        //     {
        //         saved: false
        //     }, function(err) {
        //   if (err) {
        //     // Log the error if one is encountered during the query
        //     console.log(err);
        //   } else {
        //     console.log("all recipes removed");
        //   }
        // });
        
        // Make a request via axios for the news section of `ycombinator`
        axios.get("https://www.nytimes.com/topic/subject/food").then(function(response) {
            // Load the html body from axios into cheerio
            var $ = cheerio.load(response.data);
            // An empty array to save the data that we'll scrape
        
            // For each element with a "title" class
            $("a.story-link").each(function(i, element) {
                // Save the text and href of each link enclosed in the current element
                var title = $($(element).find("h2.headline")).text().trim();
                var link = $(element).attr("href");
                var summary = $($(element).find("p.summary")[0]).text().trim();
                var results = {};

                // Add the text and href of every link, and save them as properties of the result object
                results.title = $($(element).find("h2.headline")).text().trim();
                results.link = $(element).attr("href");
                results.summary = $($(element).find("p.summary")).text().trim();
        // console.log(results.title);
        // console.log(results.link);

                // // Save these results in an object that we'll push into the results array we defined earlier
                // results.push({
                //     title: title,
                //     link: link,
                //     summary: summary
                // });
                // Create a new Article using the `result` object built from scraping
                db.Article.create(results)
                .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
                })
                .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
                return res.json(err);
                });
                
        
                // // If this found element had both a title and a link
                // if (title && link && summary) {
                //   // Insert the data in the scrapedData db
                //   db.scrapedData.insert({
                //     title: title,
                //     link: link,
                //     summary: summary
                //   },
                //   function(err, inserted) {
                //     if (err) {
                //       // Log the error if one is encountered during the query
                //       console.log(err);
                //     }
                //     else {
                //       // Otherwise, log the inserted data
                //       console.log("Scrapped recipes into DB ", inserted);
                //       //res.json(inserted);
                //     }
                //   });
                // }
            }); 

         
    //console.log(results);

    db.Article.find({}, function(error, data) {
        // Log any errors if the server encounters one
        if (error) {
            console.log(error);
        }
        // Otherwise, send the result of this query to the browser
        else {
            console.log("Reading all the recipes from DB ", data);
            res.json(data);
        }
    });

        });
    
       

    });

    //"Saving" an article changing the "saved" key from false to true
    app.put("/save-article/:articleId", function(req, res) {
        console.log(req.params.articleId);
        db.Article.findOneAndUpdate(
            {
                _id: req.params.articleId
            }, 
            {$set: { saved: true }
        }).then(function(data) {
            console.log("saved" + data);

            res.json(data);
        });
    });

    app.get("/display-saved", function(req, res) {
        db.Article.find( 
            { saved: true }
        ).then(function(data) {
            console.log(data);
            res.json(data);
        });
    });

    app.delete("/delete", function (req, res) {
        var result = {};
        result._id = req.body._id;
        console.log(result._id);
        db.Article.findOneAndRemove({
            _id: req.body._id
        }, function (err, doc) {
            // Log any errors
            if (err) {
                console.log("error:", err);
                res.json(err);
            }
            // Or log the doc
            else {
                res.json(doc);
            }
        });
    });

    app.get("/notes/:id", function (req, res) {
        console.log("Asking for all notes fron ID: " + req.params.id);
        // if(req.params.id) {
            db.Article.findOne({
                _id: req.params.id
            })
            // ..and populate all of the notes associated with it
            .populate("notes")
            .then (function (doc) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                console.log("Return result for all article notes: " + doc);
                res.json(doc);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
        //}
    });
    
    // // Create a new note or replace an existing note
    // app.post("/notes", function (req, res) {
    //     console.log(req.body);
    //     if (req.body) {
    //         var newNote = new Note(req.body);
    //         newNote.save(function (error, doc) {
    //             if (error) {
    //                 console.log(error);
    //             } else {
    //                 res.json(doc);
    //             }
    //         });
    //     } else {
    //         res.send("Error");
    //     }
    // });
    
    // Route for saving/updating an Article's associated Note
app.post("/notes/:id", function(req, res) {
    console.log(req.body);
    console.log("ID: ===========" + req.params.id);
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
      })
      .then(function(dbNote) {
        console.log("All the notes: " + dbNote);
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbNote);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route to get all User's and populate them with their notes
app.get("/populateduser", function(req, res) {
    // Find all users
    db.Article.find({})
      // Specify that we want to populate the retrieved users with any associated notes
      .populate("notes")
      .then(function(dbUser) {
        // If able to successfully find and associate all Users and Notes, send them back to the client
        res.json(dbUser);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });
  
//delete note
app.delete("/deletenote", function (req, res) {
    console.log("DELETE NOTE");
    var result = {};
    result._id = req.body._id;
    console.log(result._id);
    db.Note.findOneAndDelete({
        '_id': req.body._id
    }, function (err, doc) {
        // Log any errors
        if (err) {
            console.log("error:", err);
            res.json(err);
        }
        // Or log the doc
        else {
            console.log("deleted note");
            console.log(doc);
            res.json(doc);
        }
    });
});


}
