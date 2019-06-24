const express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var routes = require('./routes/routes');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

app.use('/', routes);

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
