var userData = {user: 'Jared', geoPosition: {}, venueType: ['bar']}
var locationKnown = false;

var initializeMiddleMap = function(middleDecision) {
  middleCoords = {longitude: middleDecision.geoPosition.coords.longitude, latitude: middleDecision.geoPosition.coords.latitude};

  var middleCoordsGoogle = new google.maps.LatLng(middleCoords.longitude, middleCoords.latitude);

  var mapOptions = {
    center: middleCoordsGoogle,
    zoom: 15,
  };

  var request = {
    location: middleCoordsGoogle,
    radius: 500, //in meters
    types: venueType
  };



  var mapCanvas = document.getElementById('map-canvas');
  var map = new google.maps.Map(mapCanvas, mapOptions);
  $(mapCanvas).css({width: '500px', height: '500px'})
  console.log($(mapCanvas));
};

var sendUserData = function(user){
  if( !locationKnown ) {
    console.log('location not known')
    return;
  }
  
  userData['user'] = user;
  if( user === 'Jared' ){
    userData.geoPosition.coords.longitude = $('input[name=user1X]').val();
    userData.geoPosition.coords.latitude = $('input[name=user1Y]').val();
    userData.venueType[0] = $('input[name=user1Venue]').val();
  }else if( user === 'Carly' ){
    //parse and stringify to get around not being able to set coords to send to server
    userData = JSON.parse(JSON.stringify(userData));
    userData.geoPosition.coords.longitude = $('input[name=user2X]').val();
    userData.geoPosition.coords.latitude = $('input[name=user2Y]').val();
    userData.venueType[0] = $('input[name=user2Venue]').val();
  }
  console.log(userData);

  $.ajax({
    type: 'POST',
    url: 'middle',
    data: JSON.stringify(userData),
    success: function(serverResponse){
      var parsedResponse = JSON.parse(serverResponse);
      if( parsedResponse.middleMatch ) initializeMiddleMap(parsedResponse);
    },
    error: function(){
      alert('Failed to POST coordinates. Please try again.');
    }
  });
};

var loadScript = function() {
  var optIn = confirm('In order to use MiddleIt we will ask for your current location. Click Ok to accept or cancel to opt out.')
  if( !optIn ) {
    document.getElementById('ui').innerHTML += ('<span id="locationError">MiddleIt cannot be used without your location. \
      Refresh the page to try again. Thank you for your understanding.</span>')
    return;
  }

  //If user opts in to browser ascertaining their location, send their coords to server
  window.navigator.geolocation.getCurrentPosition(function(geoPosition){
    userData['geoPosition'] = geoPosition;
    $('input[name=user1X]').val(userData.geoPosition.coords.longitude)
    $('input[name=user1Y]').val(userData.geoPosition.coords.latitude)
    $('input[name=user1Y]').val(userData.geoPosition.coords.latitude)
    locationKnown = true;
    console.log(userData);
  });
};

window.onload = loadScript;