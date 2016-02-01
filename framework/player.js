var extend = require('./oo.js');
var Char = require('./character.js');
var CMD = require('./cmd.js');

var Player = extend(function(socket) {
	if (!(this instanceof Player))
		return new Player();
	
	this.id = new Date().getTime() + "";
	this.name = "unamed";
	this.socket = socket;
	
	socket.player = this;
    socket.on('cmd', function(arg) {
        console.log('cmd: ' + arg.toString());
        CMD.exec(socket.player, arg);
    });
    socket.on('disconnect', function() {
    	socket.player.onDisconnected();
    });
}, Char);

Player.prototype.onDisconnected = function() {
	console.log('user disconnected');
}

Player.prototype.is_player = function() {
	return 1;
}

Player.prototype.recv_message = function(msgclz, msg) {
	//TODO this is just a temporary solution
	if (!msgclz || (msgclz !== 'fail' && msgclz !== 'room'))
		msgclz = 'resp';
	
	if (this.socket)
		this.socket.emit(msgclz, msg);
}

module.exports = Player;