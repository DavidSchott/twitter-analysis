/**
 * Created by schott on 02.12.16.
 */
$(document).ready(function () {
    $('#tabs a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})
    console.log("ready!");
});
google.charts.load('current', { 'packages': ['corechart'] });
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
    // TODO: THIS DOESN'T WORK! Have userName and tweet, check users existence
    var prms = $.get('/user',{ user: userName})
        .done(function (data){
            data = JSON.parse(data);
            if (data.hasOwnProperty('errors')){
                displayAlert("Code: "+data.errors[0].code + " " + data.errors[0].message);
                return false;
            }
            else{
            user = data;
            return true;
            }
        })
        .fail(function(xhr){
            console.log("Error fetching user",xhr);
            displayAlert("Connection error");
            return false;
        })
    return $.when(prms).done(function (exists){
        return exists;
    })
}

function displayAlert(msg) {
    $('#error-alert').html('<strong>' + msg + '</strong>');
    $('#error-alert').show();
}
function hideAlert() {
    $('#error-alert').hide();
}

function dispatchRequests(userName,tweetLimit){
        /*var p1 = new Promise(
            function(resolve,reject){
                
            }
        )
        p1.then(function(val){
            // User exists
        })
    .catch(
        // Log the rejection reason
        function(reason) {
            console.log('Handle rejected promise ('+reason+') here.');
        });*/

    if (checkRequest(userName, tweetLimit)) {
        hideAlert();
        fetchTweetsEmotions(userName,tweetLimit);
        fetchTweetsKeywords(userName,tweetLimit);
    }
    $('#tabs').show();
}

function fetchTweetsKeywords(userName,tweetLimit){
    console.log("Fetching interesting keywords from " + userName + " tweets.");
}

function fetchTweetsEmotions(userName, tweetLimit) {
        console.log("Analyzing " + tweetLimit + " emotional tweets from " + userName);
        $.get('/emotion', { user: userName, limit: tweetLimit })
            .done(function (data) {
                console.log(data);
                tweetEmotions = JSON.parse(data);
                if (!tweetEmotions.hasOwnProperty('error')){
                    visualizeEmotions(tweetEmotions);
                }
            })
            .fail(function (xhr) {
                alert("Error fetching tweets from " + userName);
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