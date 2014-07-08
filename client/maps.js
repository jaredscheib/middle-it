var userData = {user: 'Jared', geoPosition: {}, venueType: ['bar']}
var locationKnown = false;

var initializeMiddleMap = function(middleDecision) {
  var mapCanvas = document.getElementById('map-canvas');
  var map;
  var infowindow;

  var middleCoords = new google.maps.LatLng(middleDecision.middleLat, middleDecision.middleLong);
  // var middleCoords = new google.maps.LatLng($('input[name=user1Long]').val(), $('input[name=user1Lat]').val());

  var mapOptions = {
    center: middleCoords,
    zoom: 18,
  };
  map = new google.maps.Map(mapCanvas, mapOptions);
  
  var request = {
    location: middleCoords,
    // radius: 200, //in meters
    types: [middleDecision.winningVenue.winner],
    openNow: true,
    rankBy: google.maps.places.RankBy.DISTANCE
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
      position: place.geometry.location,
      icon: {
        // Star
        path: 'M 0,-24 6,-7 24,-7 10,4 15,21 0,11 -15,21 -10,4 -24,-7 -6,-7 z',
        fillColor: 'red', //original fillColor: #ffff00
        fillOpacity: 1,
        scale: 1/3, //original scale: 1/2
        strokeColor: 'black', //original strokeColor: #bd8d2c
        strokeWeight: 1
      }
    });

    google.maps.event.addListener(marker, 'click', function(){
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  };

  $(mapCanvas).css({
    width: '500px',
    height: '500px',
    margin: '10px auto 0 auto',
    border: '2px solid black'
  });
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
    userData.venueType[0] = $('#user1Venue').val();
  }else if( user === 'Carly' ){
    //parse and stringify to get around not being able to set coords to send to server
    userData = JSON.parse(JSON.stringify(userData));
    userData.geoPosition.coords.longitude = $('input[name=user2Long]').val();
    userData.geoPosition.coords.latitude = $('input[name=user2Lat]').val();
    userData.venueType[0] = $('#user2Venue').val();
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
  populateSelects();
  $('body').removeClass('hide');
  // var optIn = confirm('In order to use MiddleIt we will ask for your current location. Click Ok to accept or cancel to opt out.')
  // if( !optIn ) {
  //   document.getElementById('ui').innerHTML += ('<span id="locationError">MiddleIt cannot be used without your location. \
  //     Refresh the page to try again. Thank you for your understanding.</span>')
  //   return;
  // }

  //If user opts in to browser ascertaining their location, send their coords to server
  window.navigator.geolocation.getCurrentPosition(function(geoPosition){
    userData['geoPosition'] = geoPosition;
    $('input[name=user1Long]').val(userData.geoPosition.coords.longitude)
    $('input[name=user1Lat]').val(userData.geoPosition.coords.latitude)
    locationKnown = true;
  });
};

var populateSelects = function(){
  var venueTypes = [
    'accounting',
    'airport',
    'amusement_park',
    'aquarium',
    'art_gallery',
    'atm',
    'bakery',
    'bank',
    'bar',
    'beauty_salon',
    'bicycle_store',
    'book_store',
    'bowling_alley',
    'bus_station',
    'cafe',
    'campground',
    'car_dealer',
    'car_rental',
    'car_repair',
    'car_wash',
    'casino',
    'cemetery',
    'church',
    'city_hall',
    'clothing_store',
    'convenience_store',
    'courthouse',
    'dentist',
    'department_store',
    'doctor',
    'electrician',
    'electronics_store',
    'embassy',
    'establishment',
    'finance',
    'fire_station',
    'florist',
    'food',
    'funeral_home',
    'furniture_store',
    'gas_station',
    'general_contractor',
    'grocery_or_supermarket',
    'gym',
    'hair_care',
    'hardware_store',
    'health',
    'hindu_temple',
    'home_goods_store',
    'hospital',
    'insurance_agency',
    'jewelry_store',
    'laundry',
    'lawyer',
    'library',
    'liquor_store',
    'local_government_office',
    'locksmith',
    'lodging',
    'meal_delivery',
    'meal_takeaway',
    'mosque',
    'movie_rental',
    'movie_theater',
    'moving_company',
    'museum',
    'night_club',
    'painter',
    'park',
    'parking',
    'pet_store',
    'pharmacy',
    'physiotherapist',
    'place_of_worship',
    'plumber',
    'police',
    'post_office',
    'real_estate_agency',
    'restaurant',
    'roofing_contractor',
    'rv_park',
    'school',
    'shoe_store',
    'shopping_mall',
    'spa',
    'stadium',
    'storage',
    'store',
    'subway_station',
    'synagogue',
    'taxi_stand',
    'train_station',
    'travel_agency',
    'university',
    'veterinary_care',
    'zoo'
  ];

  var len = venueTypes.length;
  for( var i = 0; i < len; i++ ){
    $('#user1Venue').append('<option value="'+venueTypes[i]+'">'+venueTypes[i].substr(0, 1).toUpperCase()+venueTypes[i].substr(1)+'</option>')
    $('#user2Venue').append('<option value="'+venueTypes[i]+'">'+venueTypes[i].substr(0, 1).toUpperCase()+venueTypes[i].substr(1)+'</option>')
  }
  $('#user1Venue').val('bar');
  $('#user2Venue').val('bar');
};

window.onload = loadScript;