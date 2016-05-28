var http = require('http');
var Router = require('node-router');

var router = Router();
var route = router.push;

route('GET', '/', function(request, response, next) {
  response.send("Hello World!");
});

var server = http.createServer(router).listen(8000);

console.log("Server listening on 127.0.0.1:8000");
