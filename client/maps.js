// var initialize = function() {
//   var mapOptions = {
//     zoom: 8,
//     center: new google.maps.LatLng(-34.397, 150.644)
//   };

//   var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
// };

var loadScript = function() {
  var optIn = confirm('In order to use MiddleIt we will ask for your current location. Click Ok to accept or cancel to opt out.')
  if( !optIn ) {
    document.getElementById('ui').innerHTML += ('<span>MiddleIt cannot be used without your location. \
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
      data: JSON.stringify(postData)
    });
  });

  // var script = document.createElement('script');
  // script.type = 'text/javascript';
  // script.src = 'https://maps.googleapis.com/maps/api/js?key={' + API_KEY + '}&v=3.exp' +
  //              '&libraries=geometry,places&' + 'callback=initialize';
  // document.body.appendChild(script);
};

window.onload = loadScript;