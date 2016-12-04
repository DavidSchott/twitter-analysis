/**
 * Created by schott on 02.12.16.
 */
$(document).ready(function () {
    console.log("ready!");
    google.charts.load('current', { 'packages': ['corechart'] });
});
var analyzedProfiles = [];

function checkRequest(userName, tweetLimit) {
    if (userName.length < 1) {
        displayAlert('Username invalid');
        return false;
    }
    else if (tweetLimit.length <= 1 || tweetLimit > 100) {
        displayAlert('Tweet Limit must be in the range 10 < x < 100.');
        return false;
    }
    return true;
}

function displayAlert(msg) {
    $('#error-alert').html('<strong>' + msg + '</strong>');
    $('#error-alert').show();
}
function hideAlert() {
    $('#error-alert').hide();
}

function fetchTweetsEmotions(userName, tweetLimit) {
    if (checkRequest(userName, tweetLimit)) {
        hideAlert();
        console.log("Analyzing " + tweetLimit + " tweets from " + userName);
        $.get('/emotion', { user: userName, limit: tweetLimit })
            .done(function (data) {
                console.log(data);
                analyzedProfiles.push(data);
                visualizeEmotions(data);
            })
            .fail(function (xhr) {
                alert("Error fetching tweets from " + userName);
                console.log(xhr);
            });
    }
}
// TODO: How to get data?
function visualizeEmotions(emotionsResponse) {
    //google.charts.setOnLoadCallback(function(emotionsResponse){
    var data = google.visualization.arrayToDataTable([
        ['Emotion', 'Score'],
        ['Anger', emotionsResponse.anger],
        ['Disgust', emotionsResponse.disgust],
        ['Fear', emotionsResponse.fear],
        ['Joy', emotionsResponse.joy],
        ['Sadness', emotionsResponse.sadness]
    ]);

    /*var data = google.visualization.arrayToDataTable([
      ['Task', 'Hours per Day'],
      ['Work',     11],
      ['Eat',      2],
      ['Commute',  2],
      ['Watch TV', 2],
      ['Sleep',    7]
    ]);*/

    var options = {
        title: 'Sentiment Analysis of ' + emotionsResponse.userName + ' tweets'
    };

    var chart = new google.visualization.PieChart(document.getElementById('test'));

    chart.draw(data, options);
    //});
}