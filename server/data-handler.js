var api_keys = require('./api_key.js');

var google_api = process.env.GOOGLE_API || api_keys.google_api;
//TO DO: receive geoposition, combine with my API key, send to google, respond to user with action on google's response

var usersInGroup = 2; //would have a host user set this number and wait period for member responses
var users = {};
var venueChoiceCount = 0;

var User = function(data){
  console.log('data!: ', data);
  this.user = data.user;
  this.geoPosition = data.geoPosition;
  this.venueType = data.venueType;
};

var dataHandler = function(data, callback){
  var responseBody = {}; //response synthesized from users in MiddleIt group
  responseBody.type = 'user'; //if just a user signing up or logging in (likely overwritten below)
  var data = JSON.parse(data);
  
  dataRouter[data.type](data, responseBody, callback);

  // users = []; //reset users so don't have to refresh client
};

var dataRouter = {
  geoPosition: function(data, responseBody, callback){
    //TO DO: store user data in database
    //synthesize with other users' locations and run decision on choices
    //return array of options to be parsed by google maps instance
    
    users[data.user] = new User(data); //replace user if new geocoords sent
    
    console.log('DATA!', data, 'USERS!', users);

    if( Object.keys(users).length === usersInGroup ){ //if all users in group have submitted coords
      responseBody.type = 'middleCoords';
      responseBody.data = findGeoMiddle(users);
      console.log('middle: ', responseBody.data);
    }else{
      responseBody.type = 'userCoords';
      responseBody.data = data;
    }

    callback(JSON.stringify(responseBody));
  },

  venueChoice: function(data, responseBody, callback){
    users[data.user].venueChoice = data.venueChoice;
    venueChoiceCount++;

    if( venueChoiceCount === usersInGroup ){
      //determine venue choice
      //send venue choice
    }else{
    }
    callback(JSON.stringify(responseBody));
  },

  venueType: function(data, responseBody, callback){

    callback(JSON.stringify(responseBody));
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

var tallyWinner = function(pool){
  var venueCount = {};
  result.winningVenue = {winner: 'bar', votes: 0};

  //tally venues among group, single venue only, unweighted
  if( !venueCount[users[i].venueType] ) venueCount[users[i].venueType] = 0;
  venueCount[users[i].venueType]++;
  console.log(result);

  for( var item in pool ){
    //TO DO: account for ties; currently only takes one winner
    if( pool[item] > result.winningitem['votes'] ){
      result.winningItem['winner'] = item;
      result.winningItem['votes'] = pool[item];
    }
  }
};

module.exports = {
  dataHandler: dataHandler,
  // dataRouter: dataRouter
};