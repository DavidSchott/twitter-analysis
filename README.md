# portfolio3
Use IBM's AlchemyLanguage sentiment/emotion analysis to visualize emotions of tweets.

### Installation
* `npm install && bower install`
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

### Launch
* `npm start` - starts server on port 5000.