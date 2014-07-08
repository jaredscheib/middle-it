// Basic Node server
var http = require('http');
var requestHandler = require('./request-handler.js').requestHandler;

var port = process.env.port || 8000;
var ip = 'localhost';

var server = http.createServer(requestHandler);

server.listen(port, ip);

console.log('Listening on... ' + ip + ':' + port);