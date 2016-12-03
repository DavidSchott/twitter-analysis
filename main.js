// Globals
var http = require("http");
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var fs = require('fs')
// IBM Alchemy Language
var watson = require('watson-developer-cloud');
var credentials = JSON.parse(fs.readFileSync('bluemix.auth', 'utf8'));  // Hide file from git
var API_KEY = credentials.api_key;
var alchemy_language = watson.alchemy_language({
  api_key: API_KEY
})
app.use(bodyParser.json() );       // to support JSON-encoded bodies
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

app.post('/analyze', function(req,res){
  var tweets = req.body.tweets.collection
console.log('Analyzing Tweets: \n' + tweets)
  var parameters = {
    text: tweets
  };

  alchemy_language.emotion(parameters, function (err, response) {
    if (err)
      console.log('error:', err);
    else
      res.send(JSON.stringify(response, null, 2));
  });
})

app.listen(5000, function () {
  console.log('listening on port 5000!')
})
