var fs = require('fs');
var url = require('url');
var path = require('path');
var dataHandler = require('./data-handler.js').dataHandler;

var requestHandler = function(request, response){
  console.log('Serving ' + request.method + ' request for ' + request.url);
  
  var parsedPath = url.parse(request.url, true).pathname;

  if( !urlRouter[parsedPath] ){
    urlRouter['/'](request, response, '/');
  }else{
    urlRouter[parsedPath](request, response, parsedPath);
  }
};

var urlRouter = {
  '/': function(request, response, parsedPath){
    parsedPath = '/index.html'
    methodRouter[request.method](request, response, parsedPath);
  },
  '/index.html': function(request, response, parsedPath){
    methodRouter[request.method](request, response, parsedPath);
  },
  '/style.css': function(request, response, parsedPath){
    methodRouter[request.method](request, response, parsedPath);
  },
  '/maps.js': function(request, response, parsedPath){
    methodRouter[request.method](request, response, parsedPath);
  },
  'coords': function(){
    methodRouter[request.method](request, response);
  }
};

var methodRouter = {
  'GET': function(request, response, parsedPath){
    var headers = defaultCorsHeaders;
    var setHeaderByFileType = function(parsedPath){
      var fileType = '';

      if( parsedPath.indexOf('.html') !== -1 ){
        fileType = '.html';
        headers['Content-Type'] = 'text/html';
      }else if( parsedPath.indexOf('.css') !== -1 ){
        fileType = '.css';
        headers['Content-Type'] = 'text/css';
      }else if( parsedPath.indexOf('.js') !== -1 ){
        fileType = '.js';
        headers['Content-Type'] = 'text/javascript';
      }else{
        fileType = 'other';
        headers['Content-Type'] = 'text/plain';
      }
    };
    setHeaderByFileType(parsedPath);
    
    fs.readFile(path.join(__dirname, '../client') + parsedPath, function(err, data){
      if( err ) throw err;
      serveAssets(response, data, 200, headers);
    });

  },

  'POST': function(request, response){
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'text/plain';

    var dataBody = '';
    
    request.on('data', function(d){
      dataBody += d;
    });

    request.on('end', function(err){
      if( err ) throw err;

      var responseBody = 'Data received: ' + dataBody; //depends on what user sends
      
      serveAssets(response, responseBody, 201);
      
      dataHandler(dataBody);
    });

  },

  'OPTIONS': function(request, response){
    var responseBody = {
      'GET': {
        description: 'Retrieve homepage'
      },
      'POST': {
        description: 'Send coordinates for processing'
      }
    };

    serveAssets(response, responseBody, 200);
  }
};

var serveAssets = function(response, responseBody, statusCode, headers){
  // console.log(headers, responseBody);
  
  response.writeHead(statusCode, headers);
  response.end(responseBody);
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports = {
  requestHandler: requestHandler,
  defaultCorsHeaders: defaultCorsHeaders
}