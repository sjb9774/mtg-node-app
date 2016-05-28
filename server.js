var express = require('express');
var app = express();
var handler = new require('./js/handlers.js')();

app.get('/', handler.render('index.html'));

app.use(express.static('./views'));

app.listen(8000, function() {
  console.log("Server listening on 127.0.0.1:8000");
});
