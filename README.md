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
  "consumer_key": "aEPDEFM02v4T5fgx3vyECpVwr",
  "consumer_secret": "I7clviO2opBdkuWctxG5M3cPEv1h7aUST5FdYx42XpAojJAZP0",
  "access_token_key": "804796211286917121-ZBzOyN2PordaPpZBA2ChGJxDMTgbZoV",
  "access_token_secret": "D05ACLzuCbQbFth6Nbo9ut5Zr1r65KASBfqyU9plpisIM"
}
```

### Third-party docs
* [Twitter Search API](https://dev.twitter.com/rest/public/search)
* [GET request search](https://dev.twitter.com/rest/reference/get/search/tweets)
* [IBM AlchemyLanguage Emotion Analysis](http://www.ibm.com/watson/developercloud/alchemy-language/api/v1/?node#emotion_analysis)

### Launch
* `npm start` - starts server on port 5000.