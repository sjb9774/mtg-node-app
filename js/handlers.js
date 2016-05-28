var Handler = function() {
  this.render = function(htmlPath) {
    return function(request, response) {
      response.sendFile('./views/' + htmlPath, {'root': './'});
    }
  };
  return this;
}

module.exports = Handler;
