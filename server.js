var express = require('express');
var app = express();
var handler = new require('./js/handlers.js');
var myHandler = new handler();

app.get('/', myHandler.render('index.html'));
app.get('/api/:path', myHandler.getJSON);

app.use(express.static('./views'));
app.use('/views/js/', express.static(__dirname + '/views/js'));
app.use('/views/css/', express.static(__dirname + '/views/css'));

app.listen(8000, function() {
  console.log("Server listening on 127.0.0.1:8000");
});
