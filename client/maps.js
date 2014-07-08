var initializeMap = function(centralCoords) {
  centralCoords = centralCoords || {longitude: -122.4091271, latitude: 37.7837475}; //Hack Reactor coords

  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(centralCoords.longitude, centralCoords.latitude)
  };

  var mapCanvas = document.getElementById('map-canvas');
  var map = new google.maps.Map(mapCanvas, mapOptions);
  $(mapCanvas).css({width: '500px', height: '500px'})
  console.log($(mapCanvas));
};

var loadScript = function() {
  var optIn = confirm('In order to use MiddleIt we will ask for your current location. Click Ok to accept or cancel to opt out.')
  if( !optIn ) {
    document.getElementById('ui').innerHTML += ('<span id="locationError">MiddleIt cannot be used without your location. \
      Refresh the page to try again. Thank you for your understanding.</span>')
    return;
  }

  //If user opts in to browser ascertaining their location, send their coords to server
  var postData = {type: '', data: ''}
  window.navigator.geolocation.getCurrentPosition(function(geoPosition){
    postData.type = 'geoPosition',
    postData.data = geoPosition;

    $.ajax({
      type: 'POST',
      url: 'coords',
      data: JSON.stringify(postData),
      success: function(serverResponse){
        var parsedResponse = JSON.parse(serverResponse);
        var centralCoords = {longitude: parsedResponse.data.coords.longitude, latitude: parsedResponse.data.coords.latitude};
        console.log('Data received from server: ', centralCoords);
        initializeMap(centralCoords);
      },
      error: function(){
        alert('Failed to POST coordinates. Please try again.');
      }
    });
  });
};

window.onload = loadScript;