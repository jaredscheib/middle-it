var fs = require('fs');
var url = require('url');

var requestHandler = function(request, response){
  console.log('Serving ' + request.method + ' request for ' + request.url);
  
  var path = url.parse(request.url, true).pathname;

  if( !urlRouter[path] ){
    urlRouter['/'](request, response, '/');
  }else{
    urlRouter[path](request, response, path);
  }
};

var urlRouter = {
  '/': function(request, response, path){
    path = '/index.html'
    methodRouter[request.method](request, response, path);
  },
  '/index.html': function(request, response, path){
    methodRouter[request.method](request, response, path);
  },
  '/style.css': function(request, response, path){
    methodRouter[request.method](request, response, path);
  },
  '/maps.js': function(request, response, path){
    methodRouter[request.method](request, response, path);
  }
};

var methodRouter = {
  'GET': function(request, response, path){
    var headers = defaultCorsHeaders;
    var setHeaderByFileType = function(path){
      var fileType = '';

      if( path.indexOf('.html') !== -1 ){
        fileType = '.html';
        headers['Content-Type'] = 'text/html';
      }else if( path.indexOf('.css') !== -1 ){
        fileType = '.css';
        headers['Content-Type'] = 'text/css';
      }else if( path.indexOf('.js') !== -1 ){
        fileType = '.js';
        headers['Content-Type'] = 'text/javascript';
      }else{
        fileType = 'other';
        headers['Content-Type'] = 'text/plain';
      }

      console.log(path, fileType);
    };
    setHeaderByFileType(path);
    
    fs.readFile('../client' + path, function(err, data){
      if( err ) throw err;
      serveAssets(200, headers, response, data);
    });

  },

  'POST': function(request, response){
    var responseBody; //depends on what user sends

    serveAssets(201, response, responseBody);
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

    serveAssets(200, response, responseBody);
  }
};

var serveAssets = function(statusCode, headers, response, responseBody){
  console.log(headers);
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