var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jqy = require('jquery');
var path = require('path');
var fm = require(path.join(__dirname, 'framework'));

app.use('/public', express.static(__dirname + '/public'));

var npc = fm.NPC.load('test');

app.get('/', function(req, res) {
    console.log('__dirname = ' + __dirname);
    res.sendFile(path.join(__dirname,'/index.html'));
});

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});

