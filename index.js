process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

require('globals');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jqy = require('jquery');
var path = require('path');
var fm = require('framework');

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    global.BASE_PATH = __dirname;
    res.sendFile(path.join(__dirname,'/index.html'));
});

io.on('connection', function(socket) {
    var player = new fm.Player(socket);
	FUNCTIONS.move_object(player, _objs.rooms['office']);
	fm.CMD.exec(player, 'look');
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});

