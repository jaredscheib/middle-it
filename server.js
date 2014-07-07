// Basic Node server
var http = require('http');
var requestHandler = require('./request-handler.js').requestHandler;

var port = 8000;
var ip = 'localhost';

var server = http.createServer(requestHandler);
console.log('Listening on... ' + ip + ':' + port);

server.listen(port, ip);