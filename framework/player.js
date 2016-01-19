var extend = require('./oo.js');
var MObject = require('./mobject.js');
var fs = require('fs');
var path = require ('path');
var CMD = require('./cmd.js');

var Player = function(socket) {
	this.name = "unamed";
	this.socket = socket;
	
	socket.player = this;
    socket.on('cmd', function(arg) {
        console.log('cmd: ' + arg.toString());
        CMD.exec(socket.player, arg);
    });
    socket.on('disconnect', function() {
    	console.log("type of this is " + (typeof this));
    	socket.player.onDisconnected();
    });
}
extend(Player, MObject);

Player.prototype.onDisconnected = function() {
	console.log('user disconnected');
}

module.exports = Player;