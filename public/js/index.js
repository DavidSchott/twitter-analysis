/**
 * Created by schott on 02.12.16.
 */
$(document).ready(function () {
    google.charts.load('current', { 'packages': ['corechart'] });
    console.log("ready!");
});
var user;
var tweetEmotions;

function checkRequest(userName, tweetLimit) {
    if (userName.length < 1) {
        displayAlert('Username invalid');
        return false;
    }
    else if (tweetLimit.length <= 1 || tweetLimit > 100) {
        displayAlert('Tweet Limit must be in the range 10 < x < 100.');
        return false;
    }
    // Have userName and tweet, check users existence
    $.get('/user',{ user: userName})
        .done(function (data){
            data = JSON.parse(data);
            if (data.hasOwnProperty('errors')){
                displayAlert("Code: "+data.errors[0].code + " " + data.errors[0].message);
                return false;
            }
            user = data;
        })
        .fail(function(xhr){
            console.log("Error fetching user",xhr);
            displayAlert("Connection error");
            return false;
        })
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
                tweetEmotions = JSON.parse(data);
                visualizeEmotions(tweetEmotions);
            })
            .fail(function (xhr) {
                alert("Error fetching tweets from " + userName);
                console.log(xhr);
            });
    }
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

    var chart = new google.visualization.PieChart(document.getElementById('test'));

    chart.draw(data, options);
}