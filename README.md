# portfolio3
Use IBM's AlchemyLanguage sentiment/emotion analysis to visualize emotions of tweets.

### Installation

* `$ npm install && bower install`
* Add bluemix.auth file with valid IBM Bluemix API key. Example:
```
{
"api_key":"SECRET"
}
```

* Add twitter.auth file with valid Twitter API credentials. Example:
```
{
  "consumer_key": "",
  "consumer_secret": "",
  "access_token_key": "",
  "access_token_secret": ""
}
```

### Third-party docs
* [Twitter Search API](https://dev.twitter.com/rest/public/search)
* [Twitter GET request search](https://dev.twitter.com/rest/reference/get/search/tweets)
* [Twitter npm module](https://www.npmjs.com/package/twitter)
* [IBM AlchemyLanguage Emotion Analysis](http://www.ibm.com/watson/developercloud/alchemy-language/api/v1/?node#emotion_analysis)

### Endpoints

#### `/emotion`
Sending a GET request with `user` & `limit` parameters set will return a JSON object describing emotions of users tweets.
For example:
`$ curl http://localhost:5000/emotion?user=daschott94&limit=10`
will return the following JSON object:
```
{
  "anger": "0.034728",
  "disgust": "0.006738",
  "fear": "0.014644",
  "joy": "0.859004",
  "sadness": "0.10777",
  "userName": "daschott94",
  "tweets": [
    "I am doing wonderful. This is fantastic.",
    "What a beautiful day today"
  ]
}
```

### Launch

* `$ npm start` - starts server on port 5000.