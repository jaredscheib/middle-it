var API_KEY = process.env.GOOGLE_API;

var initialize = function() {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644)
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
};

var loadScript = function() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?key={' + API_KEY + '}&v=3.exp' +
               '&libraries=geometry,places&' + 'callback=initialize';
  document.body.appendChild(script);
};

window.onload = loadScript;