var api_keys = require('./api_key.js');

var google_api_key = process.env.GOOGLE_API || api_keys.google_api_key;
//TO DO: receive geoposition, combine with my API key, send to google, respond to user with action on google's response

var users = [];

var User = function(data){
  console.log('data!: ', data);
  this.user = data.user;
  this.geoPosition = data.geoPosition;
  this.venueType = data.venueType;
  console.log('new user instance: ', this)
};

var dataHandler = function(data, callback){
	var totalUsersToMatch = 2;
  var responseBody = {}; //response synthesized from users in MiddleIt group
  var parsedData = JSON.parse(data);

  //TO DO: store user data in database
  //synthesize with other users' locations and run decision on choices
  //return array of options to be parsed by google maps instance
  users.push(new User(parsedData));

  if( users.length === totalUsersToMatch ){
    responseBody = middleMatch();
    console.log('middleMatch: ', responseBody);
    responseBody['middleMatch'] = true;
  }else{
    responseBody = parsedData;
    responseBody['middleMatch'] = false;
  }
  console.log('users!: ', users);

  callback(JSON.stringify(responseBody));
  
};

// var dataRouter = {
//   geoPosition: function(data, callback){
//     // console.log(data);
//     callback();
//   }
// };

var middleMatch = function(){
  var result = {};
  result.middleLong = 0;
  result.middleLat = 0;
  var venueCount = {};
  result.winningVenue = {winner: 'bar', votes: 0};

  for( var i = 0; i < users.length; i++ ){
    result.middleLong += Number(users[i].geoPosition.coords.longitude);
    result.middleLat += Number(users[i].geoPosition.coords.latitude);

    //tally venues among group, single venue only, unweighted
    if( !venueCount[users[i].venueType] ) venueCount[users[i].venueType] = 0;
    venueCount[users[i].venueType]++;
    console.log(result);
  }

  result.middleLong /= users.length;
  result.middleLat /= users.length;

  for( var venue in venueCount ){
    //TO DO: account for ties; currently only takes one winner
    if( venueCount[venue] > result.winningVenue['votes'] ){
      result.winningVenue['winner'] = venue;
      result.winningVenue['votes'] = venueCount[venue];
    }
  }

  users = []; //reset users so don't have to refresh client
  return result;
};

module.exports = {
  dataHandler: dataHandler,
  middleMatch: middleMatch,
  // dataRouter: dataRouter
};