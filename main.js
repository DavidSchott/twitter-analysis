// Globals
var http = require("http");
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var fs = require('fs')
var Promise = require('bluebird');

// Twitter
var Twitter = require('twitter');
var credentials_twitter = JSON.parse(fs.readFileSync('twitter.auth', 'utf8'));  // Hide file from git
var client = new Twitter(credentials_twitter)

// IBM Alchemy Language
var watson = require('watson-developer-cloud');
var credentials_alchemy = JSON.parse(fs.readFileSync('bluemix.auth', 'utf8'));  // Hide file from git
var alchemy_language = watson.alchemy_language(credentials_alchemy)

// JSON parsing
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Routing Config
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// respond with "<index.html>" when a GET request is made to the homepage
app.get('/', function (req, res) {
  var options = {
    //root: __dirname,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  var file = '/index.html'
  res.sendFile(file, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', file);
    }
  });
})

function twitterSearchAsync(search) {
  return new Promise(function(resolve,reject){
    client.get('search/tweets', search, function (error, tweets, response) {
      console.log("success twitter", tweets.statuses.length);
      resolve(tweets.statuses);
    });
    
  });
}

app.get('/emotion', function (req, res) {
  var user = req.query.user
  var limit = req.query.limit
  var tags = req.query.tags
  var tweetsRead = 0;
  var min_id = Infinity;

var results = [];
var count = 0;

var search = { q: 'from:' + user + " " + tags, count: limit };
twitterSearchAsync(search).then( getMaxHistory );

function getMaxHistory (data) {  // data = tweets.statuses
    var max_id, options, oldest, newest;
    if (data.length > 0) {
      // get oldest tweet
      max_id = data[data.length - 1].id - 1;
      options = {};
      search.count = limit;
      search.max_id = max_id;
      newest = data[0].created_at;
      oldest = data[data.length - 1].created_at;

      results = results.concat(data);
    }

   // this isn't entirely necessary, but its nice to see when debugging and first trying this out
  // each request you can see for yourself that the oldest and newest are going back in time
  // to the next set of 100 tweets
   count++;    
   console.log("requests ", count, max_id, oldest, newest, "\n");

   // if theres no more tweets being returned, break recursion
    if (data.length < 2) {
      // All tweets captured
      
    } else {
      twitterSearchAsync(search).then( getMaxHistory );
    }
  }
  //var tweets_joined = '';
  /*var req1 = new Promise(
    function (resolve, reject) {
      client.get('search/tweets', { q: 'from:' + user + " " + tags, count: limit }, function (error, tweets, response) {
        if (tweets == undefined || tweets.statuses.length > 0) {
          //min_id = tweets.statuses.id[0];
          // Join tweets:
          var tweets_joined = tweets.statuses.filter(function (tweet) {
            return tweet.text.length > 10
          }).map(function (tweet) {
            tweetsRead++;
            if (tweet.id < min_id) {
              min_id = tweet.id;
            }
            return tweet.text
          }).join('\n');
          resolve(tweets_joined);
        }
        else {
          reject(JSON.stringify({ error: "No tweets found!" }));
        }
      });
    });

  req1.then(function (tweets_joined) {
      var promise_pipeline = [];
      console.log(tweets_joined);
      promise_pipeline.push(new Promise(
        function (resolve, reject) {
      min_id--;  // Off by one error (don't want duplicates)
      client.get('search/tweets', { q: 'from:' + user + " " + tags, max_id: min_id.toString() }, function (error, tweets, response) {

        if (tweets == undefined || tweets.statuses.length > 0) {
          // Join tweets:
          tweets_joined += '\n' + tweets.statuses.filter(function (tweet) {
            return tweet.text.length > 10
          }).map(function (tweet) {
            tweetsRead++;
            if (tweet.id < min_id) {
              min_id = tweet.id;
            }
            if (tweetsRead <= limit)
              return tweet.text
          }).join('\n');
          resolve(tweets_joined);
        }
      })
        }));
        Promise.all(promise_pipeline).then(values => {
          console.log(values);
        });
  });*/
  //console.log("Analyzing tweets:\n" + tweets_joined);
  /*var parameters = {
    text: tweets_joined
  };

  alchemy_language.emotion(parameters, function (err, response) {
    if (err) {
      console.log('error:', err)
      err.tweets = tweets_joined
      res.send(JSON.stringify(err, null, 2));
    }
    else {
      response.docEmotions.userName = user
      response.docEmotions.tweets = tweets_joined.split('\n')
      res.send(JSON.stringify(response.docEmotions, null, 2));
    }
  });*/
  /* } else {
     res.send(JSON.stringify({ error: "No tweets found!" }));
   }*/
  //});
});

app.get('/user', function (req, res) {
  var user = req.query.user
  client.get('users/show', { screen_name: user }, function (error, tweets, response) {
    res.send(JSON.stringify(tweets, null, 2));
  })
})

app.get('/keywords', function (req, res) {
  var user = req.query.user
  var limit = req.query.limit
  var tags = req.query.tags
  client.get('search/tweets', { q: 'from:' + user + " " + tags, count: limit }, function (error, tweets, response) {
    if (tweets == undefined || tweets.statuses.length > 0) {
      // Join tweets:
      var tweets_joined = tweets.statuses.filter(function (tweet) {
        return tweet.text.length > 10
      }).map(function (tweet) {
        return tweet.text
      }).join('\n');

      //console.log("Analyzing tweets:\n" + tweets_joined);
      var parameters = {
        text: tweets_joined,
        sentiment: 1,
        maxRetrieve: 10
      };

      alchemy_language.keywords(parameters, function (err, response) {
        if (err) {
          console.log('error:', err)
          err.tweets = tweets_joined
          res.send(JSON.stringify(err, null, 2));
        }
        else {
          response.userName = user
          res.send(JSON.stringify(response, null, 2));
        }
      });
    } else {
      res.send(JSON.stringify({ error: "No tweets found!" }));
    }
  });
});
var port = process.env.PORT || 8000
app.listen(port, function () {
  console.log('listening on port ' + port)
})
