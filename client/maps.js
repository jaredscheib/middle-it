var userData = {
  user: undefined,
  type: undefined,
  geoPosition: undefined,
  venueType: [],
  venueChoice: []
};

var initializeMiddleMap = function(middleDecision) {
  var venueChoices = [];
  var mapCanvas = document.getElementById('map-canvas');
  var map;
  var infowindow;

  var middleCoords = new google.maps.LatLng(middleDecision.coords.middleLat, middleDecision.coords.middleLong);
  // var middleCoords = new google.maps.LatLng($('input[name=user1Long]').val(), $('input[name=user1Lat]').val());

  var mapOptions = {
    center: middleCoords,
    zoom: 17,
  };
  map = new google.maps.Map(mapCanvas, mapOptions);
  
  var request = {
    location: middleCoords,
    // radius: 200, //in meters
    types: [middleDecision.winner.winningChoice], //also have winner.winningVotes for vote count
    openNow: true,
    rankBy: google.maps.places.RankBy.DISTANCE
  };

  infowindow = new google.maps.InfoWindow();
  
  var service = new google.maps.places.PlacesService(map);
  
  service.nearbySearch(request, function(results, status){
    if( status == google.maps.places.PlacesServiceStatus.OK ){
      for( var i = 0; i < results.length; i++ ){
        if( i === 5 ){ //number of choices to reveal to users
          revealVenueChoice(venueChoices);
        }
        venueChoices.push(results[i]);
        postData({type: 'venueChoicesArray', data: venueChoices}); //send all choices to server
        console.log(results[i]);
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
};

var revealVenueChoice = function(venueChoices){
  // debugger;
  console.log(venueChoices);
  var len = venueChoices.length;
  for( var i = 0; i < len; i++ ){
    $('#user1VenueChoice').append('<option value="'+venueChoices[i].name+'">'+venueChoices[i].name+'</option>');
    $('#user2VenueChoice').append('<option value="'+venueChoices[i].name+'">'+venueChoices[i].name+'</option>');
  }
  $('#user1VenueChoice').val('bar').css({width: '140px'});
  $('#user2VenueChoice').val('bar').css({width: '140px'});

  $('.userVenueChoice').css('visibility', 'visible');
};

var sendVenueType = function(user){
  userData = {};
  userData.user = user;
  userData.type = 'venueType';
  userData.venueType = [];
  if( user === 'Sam' ){
    userData.venueType[0] = $('#user1VenueType').val();
  }else if( user === 'Evan' ){
    userData.venueType[0] = $('#user2VenueType').val();
  }

  postData(userData);
  console.log('POST userData: ', userData);
};

var sendVenueChoice = function(user){
  userData = {};
  userData.user = user;
  userData.type = 'venueChoice';
  userData.venueChoice = [];
  if( user === 'Sam' ){
    userData.venueChoice[0] = $('#user1VenueChoice').val();
  }else if( user === 'Evan' ){
    userData.venueChoice[0] = $('#user2VenueChoice').val();
  }

  postData(userData);
  console.log('POST userData: ', userData);
};

var sendCustomGeoposition = function(user){
  userData = {}; // emulates users from different computers using the service
  userData.user = user;
  // userData = JSON.parse(JSON.stringify(userData)); //workaround to set coords
  userData.type = 'geoPosition';
  userData.geoPosition = {
    coords: {
      longitude: $('input[name=user2Long]').val(),
      latitude: $('input[name=user2Lat]').val()
    }
  };
  postData(userData);
};

var postData = function(data){
  $.ajax({
    type: 'POST',
    url: 'middle',
    data: JSON.stringify(data),
    success: function(serverResponse){
      serverResponse = JSON.parse(serverResponse);
      console.log('Response from server: ', serverResponse);
      responseRouter[serverResponse.type](serverResponse.data);
    },
    error: function(){
      console.log('Failed to POST '+JSON.stringify(data)+'. Please try again.');
    }
  });
};

var responseRouter = {
  user: function(response){
    console.log('Successfully stored user: ', response);
  },
  userCoords: function(response){
    console.log('Successfully stored userCoords: ', response);
  },
  middleCoords: function(response){
    console.log('Successfully matched middle: ', response);
  },
  venueTypeChosen: function(response){
    initializeMiddleMap(response);
  },
  venueChosen: function(response){
    alert("The group voted. You're heading to "+ response.winner.winningChoice + "! Directions coming soon in the next point upgrade.");
  }
};

var loadScript = function() {
  populateSelects();
  $('body').removeClass('hide');
  var optIn = confirm('In order to use MiddleIt we will ask for your current location. Click Ok to accept or cancel to opt out.')
  if( !optIn ) {
    $('#locationError').removeClass('hide');
    return;
  }

  //send coords to server (would usually notify of location use first)
  window.navigator.geolocation.getCurrentPosition(function(geoPosition){
    userData.user = 'Sam';
    userData.type = 'geoPosition';
    userData.geoPosition = geoPosition;
    console.log(userData);
    $('input[name=user1Long]').val(userData.geoPosition.coords.longitude)
    $('input[name=user1Lat]').val(userData.geoPosition.coords.latitude)
    postData(userData);
  });

  //second user with auto-gen coordinates since testing from one computer
  window.navigator.geolocation.getCurrentPosition(function(geoPosition){
    userData.user = 'Evan';
    userData.type = 'geoPosition';
    userData.geoPosition = geoPosition;
    console.log(userData);
    $('input[name=user2Long]').val(userData.geoPosition.coords.longitude)
    $('input[name=user2Lat]').val(userData.geoPosition.coords.latitude)
    postData(userData);
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
    $('#user1VenueType').append('<option value="'+venueTypes[i]+'">'+venueTypes[i].substr(0, 1).toUpperCase()+venueTypes[i].substr(1)+'</option>');
    $('#user2VenueType').append('<option value="'+venueTypes[i]+'">'+venueTypes[i].substr(0, 1).toUpperCase()+venueTypes[i].substr(1)+'</option>');
  }
  $('#user1VenueType').val('bar');
  $('#user2VenueType').val('bar');
};

window.onload = loadScript;