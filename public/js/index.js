/**
 * Created by schott on 02.12.16.
 */
$( document ).ready(function() {
    console.log( "ready!" );
});
var analyzedProfiles = [];

function checkRequest(userName,tweetLimit){
    if (userName.length < 1){
        displayAlert('Username invalid');
        return false;
    }
    else if (tweetLimit.length <= 1 || tweetLimit > 100){
        displayAlert('Tweet Limit must be in the range 10 < x < 100.');
        return false;
    }
    return true;
}

function displayAlert(msg){
    $('#error-alert').html('<strong>' + msg + '</strong>');
    $('#error-alert').show();
}
function hideAlert(){
    $('#error-alert').hide();
}

function fetchTweetsResponse(userName,tweetLimit){
    if (checkRequest(userName,tweetLimit)){
        hideAlert();
        console.log("Analyzing " + tweetLimit + " tweets from " + userName);
        $.get('/emotion',{user:userName,limit:tweetLimit})
            .done(function(data){
                console.log(data);
                analyzedProfiles.push(data);
            })
            .fail(function(msg){
                alert("Error fetching tweets from " + userName);
                console.log(msg);
            });
    }
}