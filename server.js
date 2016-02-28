var express = require('express');
var auth = require('./auth');

var app = express();
var port = process.env.PORT || 8080;

app.post('/auth', auth.auth);

app.get('/', function(req, res) {
    res.status(200).send('No permissions zone');
});

app.get('/articles', auth.hasPermission('articles'), function(req, res) {
    res.status(200).send('Articles');
});

app.get('/users', auth.hasPermission('users'), function(req, res) {
    res.status(200).send('Users');
});

app.listen(port);
