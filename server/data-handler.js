var api_keys = require('./api_key.js');

var google_api_key = process.env.GOOGLE_API || api_keys.google_api_key;

//tell them we are about to use your location - conversion rates will be higher
//do a timeout that if not resolved we tell them we need their location

//take their geolocation, combine it with my API key in a separate required file, and send to google


var dataHandler = function(data){
	var parsedData = JSON.parse(data);
  console.log('Data received!! ' + JSON.stringify(parsedData));
};

module.exports = {
  dataHandler: dataHandler
};