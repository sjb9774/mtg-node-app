var qs = require('querystring');
var req = require('request');

var Handler = function() {}
Handler.apiUrl = "http://127.0.0.1:9000";

Handler.prototype.render = function(htmlPath) {
  return function(request, response) {
    console.log("Serving " + htmlPath);
    response.sendFile('./views/' + htmlPath, {'root': './'});
  }
};

Handler.prototype.getApiJson = function(request, response, next) {
  var path = request.path;
  var queryArgs = qs.stringify(request.query);
  var fullUrl = Handler.apiUrl + path + (queryArgs ? '?' + queryArgs : '');
  req(fullUrl, function(err, resp, body) {
    response.set({"Content-type": "application/json"}).send(body);
  });
}

module.exports = Handler;
