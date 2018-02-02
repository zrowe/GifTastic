var debug = 0 // my handy console debug flag

// Initial array of topics
var topics = ["aircraft accidents", "house fires", "addams family", "train wrecks", "slender man", "babadook"];
var prompt = "";

// displayMovieInfo function re-renders the HTML to display the appropriate content
function displayGifs() {

    var topic = $(this).attr("data-name");
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=0gpg33lyPji2L7YrGHwBEjwf9muwtglO&q=" + encodeURIComponent(topic) + "&limit=10&offset=0&lang=en";

    $.ajax({ // launch query for the top 
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        if (debug) { console.log(response) };

        // clear any gifs in the display
        $("#gifs-view").empty();

        for (var i = 0; i < response.data.length; i++) {
            if (debug) { console.log(i) };

            // Create a div to hold a gif block
            var gifDiv = $("<div class='gif-block'>");


            // Create and add an element to hold the image
            var imgURL = response.data[i].images.fixed_height_still.url; // the still image
            var animateURL = response.data[i].images.fixed_height.url; // the animated image
            var imgTitle = response.data[i].title;
            var image = $("<img>")
            image.attr({
                "src": imgURL,
                "alt": imgTitle,
                "data-still": imgURL,
                "data-animate": animateURL,
                "data-state": "still"
            });
            image.addClass("gif");
            gifDiv.append(image);

            // Create and add an element to hold the rating
            var rating = response.data[i].rating;
            var myRating = $("<p>").text("Rating: " + rating);
            myRating.addClass("rating");
            gifDiv.append(myRating);

            // Display a gif Block
            $("#gifs-view").append(gifDiv);
        };
    });
}

// Function for displaying the topic buttons
function renderButtons() {
    if (debug) { console.log("renderButtons:") }

    // Delete any existing buttons
    $("#topics-view").empty();

    // Generate Buttons for each member of topic
    for (var i = 0; i < topics.length; i++) {
        var myButton = $("<button>");
        myButton.addClass("topic-btn");
        myButton.attr("data-name", topics[i]);
        myButton.text(topics[i]);
        $("#topics-view").append(myButton);
    }
}

// Adding a click event listener to all elements with a class of "topic-btn"
$(document).on("click", ".topic-btn", displayGifs);


$(document).on("click", ".gif", function() {
    var state = $(this).attr("data-state");
    // toggle the state (still vs animated) and update the src accordingly
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
});


$("#add-topic").on("click", function(event) {
    event.preventDefault();
    var topic = $("#topic-input").val().trim();
    if (topic !== "" && topics.indexOf(topic) == -1) { // ignore empty input or duplicate
        topics.push(topic);
        renderButtons();
    }
    $("#topic-input").val(prompt);
});


// Calling the renderButtons function to display the intial buttons
renderButtons();
$("#topic-input").val(prompt);