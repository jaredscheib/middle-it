var api_keys = require('./api_key.js');

var google_api = process.env.GOOGLE_API || api_keys.google_api;
//TO DO: receive geoposition, combine with my API key, send to google, respond to user with action on google's response

var usersInGroup = 2; //would have a host user set this number and wait period for member responses
var users = {};
var venueChoicesArray = [];
var venueTypeCount = 0;
var venueChoiceCount = 0;

var User = function(data){
  this.user = data.user;
  this.geoPosition = data.geoPosition;
  this.venueType = data.venueType;
};

var dataHandler = function(data, callback){
  var responseBody = {}; //response synthesized from users in MiddleIt group
  responseBody.type = 'user'; //if just a user signing up or logging in (likely overwritten below)
  var data = JSON.parse(data);

  console.log('data!', data);
  
  dataRouter[data.type](data, responseBody, callback);

  // users = []; //reset users so don't have to refresh client
};

var dataRouter = {
  geoPosition: function(data, responseBody, callback){
    //TO DO: store user data in database
    //synthesize with other users' locations and run decision on choices
    //return array of options to be parsed by google maps instance
    
    users[data.user] = new User(data); //replace user if new geocoords sent
    

    if( Object.keys(users).length === usersInGroup ){ //if all users in group have submitted coords
      responseBody.type = 'middleCoords';
      responseBody.data = findGeoMiddle(users);
    }else{
      responseBody.type = 'userCoords';
      responseBody.data = data;
    }
    console.log('users!', JSON.stringify(users));
    callback(JSON.stringify(responseBody));
  },

  venueType: function(data, responseBody, callback){
    users[data.user].venueType = data.venueType;
    venueTypeCount++;

    if( venueTypeCount === usersInGroup ){
      responseBody.type = 'venueTypeChosen';
      responseBody.data = {};
      responseBody.data.coords = findGeoMiddle(users);
      responseBody.data.winner = tallyWinner('venueType');
      console.log('findGeoMiddle: ', responseBody.data.coords, 'tallyWinner: ', responseBody.data.winningVenueType);
    }
    callback(JSON.stringify(responseBody)); //TO DO: no need to send responseBody
  },

  venueChoice: function(data, responseBody, callback){
    users[data.user].venueChoice = data.venueChoice;
    venueChoiceCount++;

    if( venueChoiceCount === usersInGroup ){
      //determine venue choice
      //send venue choice
    }else{
    }
    callback(JSON.stringify(responseBody)); //TO DO: no need to send responseBody
  },

  venueChoicesArray: function(data, responseBody, callback){
    venueChoicesArray = responseBody;
    console.log('venueChoicesArray: ', venueChoicesArray);
    callback(JSON.stringify(responseBody)); //TO DO: no need to send responseBody
  }
};

var findGeoMiddle = function(users){
  var userCount = 0;
  var middle = {
    middleLong: 0,
    middleLat: 0
  };

  for( var user in users ){
    middle.middleLong += Number(users[user].geoPosition.coords.longitude);
    middle.middleLat += Number(users[user].geoPosition.coords.latitude);
    userCount++;
  }

  middle.middleLong /= userCount; //could do Object.keys but that would cost another iteration
  middle.middleLat /= userCount;

  return middle;
};

var tallyWinner = function(type){
  var tallyObj = {};
  var result = {};

  //tallyObj venues among group, single venue only, unweighted
  for( var user in users ){
    if( !tallyObj[users[user][type]] ) tallyObj[users[user][type]] = 0;
    tallyObj[users[user][type]]++;
  }

  result.winner = 'bar';
  result.votes = 0;

  for( var item in tallyObj ){
    //TO DO: account for ties; currently only takes one winner
    if( tallyObj[item] > result.votes ){
      result.winner = item;
      result.votes = tallyObj[item];
    }
  }

  console.log('tallyObj: ', tallyObj, 'result: ', result);
  return {
    winningChoice: result.winner,
    winningVotes: result.votes
  };
};

module.exports = {
  dataHandler: dataHandler,
  // dataRouter: dataRouter
};