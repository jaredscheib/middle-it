var api_keys = require('./api_key.js');

var google_api_key = process.env.GOOGLE_API || api_keys.google_api_key;

//receive geoposition, combine with my API key, send to google, respond to user with action on google's response

var dataHandler = function(data){
	var parsedData = JSON.parse(data);

  //TO DO: save data to database

  dataRouter[parsedData.type](parsedData.data);
};

var dataRouter = {
  geoPosition: function(data){
    console.log(data);
  }
};

module.exports = {
  dataHandler: dataHandler,
  dataRouter: dataRouter
};