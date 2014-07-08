var userData = {user: 'Jared', geoPosition: {}, venueType: ['bar']}
var locationKnown = false;

var initializeMiddleMap = function(middleDecision) {
  var mapCanvas = document.getElementById('map-canvas');
  var map;
  var infowindow;

  var middleCoords = new google.maps.LatLng(middleDecision.middleLong, middleDecision.middleLat);
  // var middleCoords = new google.maps.LatLng($('input[name=user1Long]').val(), $('input[name=user1Lat]').val());

  var mapOptions = {
    center: middleCoords,
    zoom: 15,
  };
  map = new google.maps.Map(mapCanvas, mapOptions);
  
  var request = {
    location: middleCoords,
    radius: 500, //in meters
    types: [middleDecision.winningVenue.winner]
  };

  infowindow = new google.maps.InfoWindow();
  
  var service = new google.maps.places.PlacesService(map);
  
  service.nearbySearch(request, function(results, status){
    if( status == google.maps.places.PlacesServiceStatus.OK ){
      for( var i = 0; i < results.length; i++ ){
        createMarker(results[i]);
      }
    }
  });

  var createMarker = function(place){
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function(){
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  };

  $(mapCanvas).css({width: '500px', height: '500px'})
  console.log($(mapCanvas));
};

var sendUserData = function(user){
  if( !locationKnown ) {
    console.log('Location not yet known')
    return;
  }
  
  userData['user'] = user;
  if( user === 'Jared' ){
    userData.geoPosition.coords.longitude = $('input[name=user1Long]').val();
    userData.geoPosition.coords.latitude = $('input[name=user1Lat]').val();
    userData.venueType[0] = $('input[name=user1Venue]').val();
  }else if( user === 'Carly' ){
    //parse and stringify to get around not being able to set coords to send to server
    userData = JSON.parse(JSON.stringify(userData));
    userData.geoPosition.coords.longitude = $('input[name=user2Long]').val();
    userData.geoPosition.coords.latitude = $('input[name=user2Lat]').val();
    userData.venueType[0] = $('input[name=user2Venue]').val();
  }
  console.log('POST userData: ', userData);

  $.ajax({
    type: 'POST',
    url: 'middle',
    data: JSON.stringify(userData),
    success: function(serverResponse){
      var parsedResponse = JSON.parse(serverResponse);
      console.log('Response from server: ', parsedResponse);
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
    $('input[name=user1Long]').val(userData.geoPosition.coords.longitude)
    $('input[name=user1Lat]').val(userData.geoPosition.coords.latitude)
    locationKnown = true;
  });
};

window.onload = loadScript;