/**
 * Created by schott on 02.12.16.
 */
$(document).ready(function () {
    $('#tabs a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})
$('.results').hide();
    console.log("ready!");
});
// Globals
google.charts.load('current', { 'packages': ['corechart', 'bar'] });
var user;
var tweetEmotions;
var keyWords;

// TODO: add validation of hashtags
function checkRequest(userName, tweetLimit,hashTags,resolve,reject) {
    if (userName.length < 1) {
        reject('Username invalid');
        return false;
    }
    else if (tweetLimit.length <= 1 || tweetLimit > 100) {
        reject('Tweet Limit must be in the range 10 < x < 100.');
        return false;
    }
    var prms = $.get('/user',{ user: userName})
        .done(function (data){
            data = JSON.parse(data);
            if (data.hasOwnProperty('errors')){
                reject("Code: "+data.errors[0].code + " " + data.errors[0].message);
            }
            else{
                user = data;
                resolve(data);
            }
        })
        .fail(function(xhr){
            console.log("Error fetching user",xhr);
            displayAlert("Connection error");
            reject("Connection error");
            return false;
        })
}

function displayAlert(msg) {
    $('#error-alert').html('<strong>' + msg + '</strong>');
    $('#error-alert').show();
}
function hideAlert() {
    $('#error-alert').hide();
}

function dispatchRequests(userName,tweetLimit,hashTags){
        var p1 = new Promise(
            function(resolve,reject){
                checkRequest(userName, tweetLimit,hashTags,resolve,reject);
            }
        )
        p1.then(function(userData){
            console.log(userData);
            // User exists
            hideAlert();
            insertUserInfo();
            fetchTweetsEmotions(userName,tweetLimit,hashTags);
            fetchTweetsKeywords(userName,tweetLimit,hashTags);
            // Display results
            $('.results').show();
        })
    .catch(
        // Log the rejection reason (user doesn't exist')
        function(reason) {
            console.log(reason);
            displayAlert(reason);
        });
}

function fetchTweetsKeywords(userName,tweetLimit,hashTags){
    console.log("Fetching interesting keywords from " + userName + " tweets.");
     $.get('/keywords', { user: userName, limit: tweetLimit, tags:hashTags })
            .done(function (data) {
                keyWords = JSON.parse(data).keywords;
                if (!keyWords.hasOwnProperty('error')){
                    visualizeKeywords(keyWords);
                }
            })
            .fail(function (xhr) {
                alert("Error fetching keywords from " + userName);
                console.log(xhr);
            });
}

function visualizeKeywords(keywordsResponse){
    document.getElementById('keyword-chart').innerText = JSON.stringify(keywordsResponse, null,2);
    /*var data = google.visualization.arrayToDataTable([
        ["Keyword", "Density", { role: "style" } ],
        ["Copper", 8.94, "#b87333"],
        ["Silver", 10.49, "silver"],
        ["Gold", 19.30, "gold"],
        ["Platinum", 21.45, "color: #e5e4e2"]
      ]);

      var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       2]);

      var options = {
        title: user +"'s top 10 keywords sentiments",
        width: 600,
        height: 400,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
      };
      var chart = new google.visualization.ColumnChart(document.getElementById("keyword-chart"));
      chart.draw(view, options);*/
}

function fetchTweetsEmotions(userName, tweetLimit,hashTags) {
        console.log("Analyzing " + tweetLimit + " emotional tweets from " + userName);
        $.get('/emotion', { user: userName, limit: tweetLimit, tags:hashTags })
            .done(function (data) {
                tweetEmotions = JSON.parse(data);
                if (!tweetEmotions.hasOwnProperty('error')){
                    visualizeEmotions(tweetEmotions);
                }
		tweets = tweetEmotions.tweets;
            })
            .fail(function (xhr) {
                alert("Error fetching emotions from " + userName);
                console.log(xhr);
            });
}

function visualizeEmotions(emotionsResponse) {
    console.log("Visualizing",emotionsResponse);
    var data = google.visualization.arrayToDataTable([
        ['Emotion', 'Score'],
        ['Anger', parseFloat(emotionsResponse.anger)],
        ['Disgust', parseFloat(emotionsResponse.disgust)],
        ['Fear', parseFloat(emotionsResponse.fear)],
        ['Joy', parseFloat(emotionsResponse.joy)],
        ['Sadness', parseFloat(emotionsResponse.sadness)]
    ]);

    var options = {
        title: 'Emotion Analysis of ' + emotionsResponse.userName + ' tweets'
    };

    var chart = new google.visualization.PieChart(document.getElementById('emotion-chart'));

    chart.draw(data, options);
}

function insertUserInfo() {
    document.getElementById("user-profile-pic").src = user.profile_image_url;
    document.getElementById("user-name").innerHTML = user.name;
    document.getElementById("user-screen-name").innerHTML = "@" + user.screen_name;
    document.getElementById("user-description").innerHTML = user.description;
    document.getElementById("user-followers-count").innerHTML = user.followers_count;
    document.getElementById("user-friends-count").innerHTML = user.friends_count;
    document.getElementById("user-favourites-count").innerHTML = user.favourites_count;
}

function insertTweets() {
    var text = "";
    for (var i=0; i<tweets.length; i++) {
	text += tweets[i] + "<br><br>";
    }
    document.getElementById("tweets-heading").innerHTML = user.name + "'s tweets:";
    document.getElementById("tweets").innerHTML = text;
}
