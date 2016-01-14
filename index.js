process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jqy = require('jquery');
var path = require('path');
var fm = require('framework');

app.use('/public', express.static(__dirname + '/public'));

global.cmds = {};
global.objs = { 'players' : {}, 'rooms': {}, 'item' : {} };

app.get('/', function(req, res) {
    console.log('__dirname = ' + __dirname);
    res.sendFile(path.join(__dirname,'/index.html'));
});

io.on('connection', function(socket) {
    console.log('a user connected' + typeof socket);
    var player = new fm.Player(socket);
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});

