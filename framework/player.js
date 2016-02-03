var extend = require('./oo.js');
var Char = require('./character.js');
var CMD = require('./cmd.js');

var Player = extend(function(socket) {
	if (!(this instanceof Player))
		return new Player();
	
	this.id = new Date().getTime() + "";
	this.name = "unamed";
	this.socket = socket;
	
	//temporary code begin
	this.water = 500;
	this.max_water = 500;
	this.food = 500;
	this.max_food = 500;
	//temporary code end
	
	socket.player = this;
    socket.on('cmd', function(arg) {
    	if (!arg || !arg.cmd)
    		return;
    	
        CMD.exec(socket.player, arg.cmd, arg.arg);
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
	if (!msgclz || (msgclz !== 'fail' && msgclz !== 'room' && msgclz !== 'hp'))
		msgclz = 'resp';
	
	if (this.query_tmp('block_msg/all'))
		return;
	
	if (this.socket)
		this.socket.emit(msgclz, msg);
}

Player.prototype.is_interactive = function() {
	//TODO if socket is disconnected, return 0;
	return 1;
}

Player.prototype.is_newbie = function() {
	return 0;
}

module.exports = Player;