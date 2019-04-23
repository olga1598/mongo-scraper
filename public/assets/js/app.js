console.log("Javascript file connected");

// $(function () {
function displayScrape() {
    //$(".scrape-new").on("click", function(event) {

        $.ajax({
            type: "GET",
            url: "/scrape"
        }).then(function(data) {
            
            console.log("recipes scraped");
            console.log(data);
            $("#saved").hide();
            $("#scrapeResults").show();
            displayResults(data);
            hideContainer();
            showScrapeResults();
        
            //location.replace("/scrapped");

        })
    //})
};

//Function for displaying results
function displayResults(data) {
    $("#nyt-0").empty();
    $("#nyt-1").empty();
    $("#nyt-2").empty();
    $("#total-number").text(data.length);
    for (var i = 0; i < data.length; i++) {
        var mainDiv = $("<div>");
        mainDiv.addClass("card grey lighten-2");
        var cardContentDiv = $("<div>");
        cardContentDiv.addClass("card-content black-text");
        var spanTitle = $("<span>");
        spanTitle.addClass("card-title");
        spanTitle.attr("data-id", data[i]._id);
        spanTitle.attr("id", "title-" + data[i]._id);
        spanTitle.text(data[i].title);
        var p = $("<p>");
        p.text(data[i].summary);
        p.attr("id", "summary-" + data[i]._id);
        cardContentDiv.append(spanTitle);
        cardContentDiv.append(p);
        var cardActionDiv = $("<div>");
        cardActionDiv.addClass("card-action");
        var a = $("<a>");
        a.attr("href", data[i].link);
        a.attr("id", "link-" + data[i]._id);
        a.text("Go to the article");
        cardActionDiv.append(a);
        var saveArticle = $("<a>");
        saveArticle.addClass("waves-effect waves-light btn save-button");
        saveArticle.attr("id", data[i]._id);
        saveArticle.text("Save Article");
        var byline = $("<p>");
        byline.text(data[i].byline);
        byline.attr("id", "byline-" + data[i]._id);
        cardActionDiv.append(byline);
        // cardActionDiv.append(button);
        cardActionDiv.append(saveArticle);
        mainDiv.append(cardContentDiv);
        mainDiv.append(cardActionDiv);
        $("#nyt-" + String(i % 3)).append(mainDiv);
    }
};

// When click on delete article button
$(document).on('click', '.delete-button', function () {
    var thisId = $(this).attr("id");
    console.log("Will delete: " + thisId)
    var summary = $("#summary-" + thisId).text();
    var title = $("#title-" + thisId).text();
    var link = $("#link-" + thisId).attr('href');
    var byline = $("#byline-" + thisId).text();
    var data = {
        "_id": thisId
    };
    $.ajax({
        type: "DELETE",
        url: "/delete",
        data: data,
        success: function (data, textStatus) {
            $("#main-" + thisId).remove();
        }
    })
});

        // var articleResults = $("#results");
        // articleResults.empty();

        // for (i = 0; i < response.length; i++) {
        //     var article = response[i];

        //     var saveButton = $("<button>")
        //         .addClass("saveButton")
        //         .text("Save")
        //         .attr("id", article._id);

        //     var title = $("<div>")
        //         .addClass("title")
        //         .text(article.title)
        //         .append(saveButton);

        //     var link = $("<a>")
        //         .addClass("link")
        //         .text(article.link)
        //         .attr("href", article.link)
        //         .attr("target", "_blank");

        //     var summary = $("<p>")
        //         .addClass("summary")
        //         .text(article.summary)

        //     var listItem = $("<li>")
        //         .addClass("article")
        //         .append(title, link, summary);

        //     articleResults.append(listItem);
        // }
    

    var hideContainer = function() {
        $(".alert").hide();
    
    };
    
    var showScrapeResults = function() {
        $("#scrapeResults").show(600);
    };
    
//When click on save single article button
$(document).on("click", '.save-button', function(){
    var articleId = $(this).attr('id');
    console.log("Article ID: " + articleId);

    $.ajax({
        type: "PUT",
        url: "/save-article/" + articleId,
    }).then(function(response) {
        console.log(JSON.stringify(response));
        
    });
});
   
//Display all saved articles
function displaySaved() {
    $.getJSON("/display-saved", function (data) {
        $("#nyt-0").empty();
        $("#nyt-1").empty();
        $("#nyt-2").empty();
        $("#total-number").text(data.length);
        for (var i = 0; i < data.length; i++) {
            var mainDiv = $("<div>");
            mainDiv.addClass("card grey lighten-2");
            mainDiv.attr("id", "main-" + data[i]._id);
            var cardContentDiv = $("<div>");
            cardContentDiv.addClass("card-content black-text");
            var spanTitle = $("<span>");
            spanTitle.addClass("card-title");
            spanTitle.attr("data-id", data[i]._id);
            spanTitle.attr("id", "title-" + data[i]._id);
            spanTitle.text(data[i].title);
            var p = $("<p>");
            p.text(data[i].summary);
            p.attr("id", "summary-" + data[i]._id);
            cardContentDiv.append(spanTitle);
            cardContentDiv.append(p);
            var cardActionDiv = $("<div>");
            cardActionDiv.addClass("card-action");
            var a = $("<a>");
            a.attr("href", data[i].link);
            a.attr("id", "link-" + data[i]._id);
            a.text("Go to the article");
            cardActionDiv.append(a);
            var button = $("<a>");
            button.addClass("waves-effect waves-light white btn create-note modal-trigger");
            button.attr("data-id", data[i]._id);
            button.attr("data-toggle", "modal");
            button.attr("data-target", "#notes");
            button.text("Create Notes");
            var deleteArticle = $("<a>");
            deleteArticle.addClass("waves-effect waves-light white btn delete-button");
            deleteArticle.attr("id", data[i]._id);
            deleteArticle.text("Delete");
            var byline = $("<p>");
            byline.text(data[i].byline);
            cardActionDiv.append(byline);
            cardActionDiv.append(button);
            cardActionDiv.append(deleteArticle);
            mainDiv.append(cardContentDiv);
            mainDiv.append(cardActionDiv);

            $("#nyt-" + String(i % 3)).append(mainDiv);
        }
    });
};

$(document).ready(function(){      
    displaySaved(); 
});


// create note
$(document).on("click", ".create-note", function (data) {
    //alert($(this).attr("data-id"));
    $("#savenote").attr("data-id", $(this).attr("data-id"));
    // <div id="display-note"></div>
    console.log("Creating note for this article: ", $(this).attr("data-id"));
    var aid = $(this).attr("data-id");
    //console.log(title);
    $("#display-title").empty();
    // $("#display-title").text(title);
    $("#textarea1").val("");
    $.ajax({
        method: "GET",
        url: "/notes/" + aid
      }).then(function(data) { 
        //$("#display-note").text("Notes for the Article: " + data.note.title);
        // console.log(data.note.title);
        // console.log(data.note.body);
        console.log(data.notes);            

        //var notetext = "Notes: " + data[0].body;
        $("#display-note").empty();
        var noteList = $("<ul>");
        noteList.addClass("collection with-header");
        var hli = $("<li>");
        hli.addClass("collection-header")
        hli.text("Saved notes");
        noteList.append(hli);
        // console.log(data.note.title);
        // console.log(data.note._id);
        // console.log(data.note.body);
        for (var i = 0; i < data.notes.length; i++) {        
            console.log(data.notes[i]._id);

            //$("#notetitle").append(data.note.title);
            var ili = $("<li>");
            ili.attr("id", data.notes[i]._id);
            ili.addClass("collection-item");

            var idiv = $("<div>");
            idiv.text(data.notes[i].body);

            // var button = $("<button>");
            // button.attr("button-id", data.notes[i]._id);
            // button.addClass("note-delete-button");
            // button.attr("type", "delete");

            idiv.append(data.notes[i].body,);

            var adelete = $("<a>");
            adelete.addClass("secondary-content");
            adelete.attr("note-id", data.notes[i]._id);
            adelete.attr("href", "#");
            adelete.attr("onclick", 'deletenote("' + data.notes[i]._id + '")');
            var xdelete = $("<i>");
            xdelete.addClass("material-icons");
            xdelete.attr("note-id", data.notes[i]._id);
            xdelete.html("delete");
            adelete.append(xdelete);
            idiv.append(data.notes[i].body, " ", adelete);
            ili.append(idiv);
            noteList.append(ili);        
            $("#display-note").append(noteList);

        }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    // get the user input value 
    var thisId = $(this).attr("data-id");
    var text = $("#textarea1").val();
    var notetitle = $("#notetitle").val();
   console.log(text);
    // console.log(thisId);, data.note
    console.log(notetitle);
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        type: "POST",
        url: "/notes/" + thisId,
        data: {
            title: notetitle,
            body: text
        },
    })
    //when it's done
    .then(function(data) {
        //$('.modal').modal('hide');
        // Log the response
        console.log(data);

    })
});

// delete note button
$(document).on("click", "#deletenote", function () {
    var noteId = $(this).attr("button-id");
    console.log(noteId);
    var data = {
        "_id": noteId
    };
    $.ajax({
        type: "DELETE",
        url: "/deletenote",
        data: data,
        success: function (data, textStatus) {
            $("#display-note" + noteId).remove();
        }
    })
});

// // When you click the savenote button
// $(document).on("click", "#savenote", function() {
//     // Grab the id associated with the article from the submit button
//     var thisId = $(this).attr("data-id");
  
//     // Run a POST request to change the note, using what's entered in the inputs
//     $.ajax({
//       method: "POST",
//       url: "/articles/" + thisId,
//       data: {
//         // Value taken from title input
//         title: $("#titleinput").val(),
//         // Value taken from note textarea
//         body: $("#bodyinput").val()
//       }
//     })
//       // With that done
//       .then(function(data) {
//         // Log the response
//         console.log(data);
//         // Empty the notes section
//         $("#notes").empty();
//       });
  


    // $.getJSON("/display-saved", function(data) {
    //     console.log(data);
    //     $("#scrapeResults").hide();
    //     var savedArticleResults = $("#savedArticles");
    //     savedArticleResults.empty();
    //     // For each one
    //     for (var i = 0; i < data.length; i++) {
    //     // Display the apropos information on the page
    //              var savedArticle = data[i];
    //                  var deleteButton = $("<button>")
    //                  .addClass("deleteButton")
    //                  .text("Delete")
    //                  .attr("id", savedArticle._id);
    
    //              var notesButton = $("<button>")
    //                  .addClass("notesButton")
    //                  .text("Notes")
    //                  .attr("id", savedArticle._id);
    
    //              var title = $("<div>")
    //                  .addClass("title")
    //                  .text(savedArticle.title)
    //                  .append(deleteButton)
    //                  .append(notesButton);
    
    //              var link = $("<a>")
    //                  .addClass("link")
    //                  .text(savedArticle.link)
    //                  .attr("href", savedArticle.link)
    //                  .attr("target", "_blank");
    
    //              var summary = $("<p>")
    //                  .addClass("summary")
    //                  .text(savedArticle.summary);
    
    //              var listItem = $("<li>")
    //                  .addClass("article")
    //                  .append(title, link, summary);
    
    //              savedArticleResults.append(listItem);
    //         }
    

    //     //displayResults(data);
    //     //   $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        
    //   });
      

    // $(".viewSavedArticles").on("click", function(event) {
    //     $.ajax({
    //         type:"GET",
    //         url:"/display-saved"
    //     }).then(function(response) {
    //         console.log(response);
    //         const savedArticleResults = $("#savedArticles");
    //         savedArticleResults.empty();
    
    //         for (i = 0; i < response.length; i++) {
    //             var savedArticle = response[i];
    
    //             var deleteButton = $("<button>")
    //                 .addClass("deleteButton")
    //                 .text("Delete")
    //                 .attr("id", savedArticle._id);
    
    //             var notesButton = $("<button>")
    //                 .addClass("notesButton")
    //                 .text("Notes")
    //                 .attr("id", savedArticle._id);
    
    //             var title = $("<div>")
    //                 .addClass("title")
    //                 .text(savedArticle.title)
    //                 .append(deleteButton)
    //                 .append(notesButton);
    
    //             var link = $("<a>")
    //                 .addClass("link")
    //                 .text(savedArticle.link)
    //                 .attr("href", savedArticle.link)
    //                 .attr("target", "_blank");
    
    //             var summary = $("<p>")
    //                 .addClass("summary")
    //                 .text(savedArticle.summary);
    
    //             var listItem = $("<li>")
    //                 .addClass("article")
    //                 .append(title, link, summary);
    
    //             savedArticleResults.append(listItem);
    //         }
    

    //         location.replace("/saved");
    
    //     })
    // });

    // $(".save").on("click", function(event) {
    //     $.ajax({
    //         type: "POST",
    //         url: "/save"
    //     }).then(function(data) {
            
    //         console.log("recipes saved");
    //         console.log(data);
    //         //displayResults(data);
    //     })

    // })
//});
