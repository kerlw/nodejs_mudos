var extend = require('./oo.js');
var Char = require('./character.js');
var CMD = require('./cmd.js');

var Player = extend(function(socket, model) {
	if (!(this instanceof Player))
		return new Player();
	
	if (!model)
		throw "[ERROR] want to create player without char model ?";
	
	this.socket = socket;

	this.id = model.id;
	this.name = model.nickname;
	this.mudage = model.mudage;
	this.str = model.str;
	this.con = model.con;
	this.int = model.int;
	this.apc = model.apc;
	this.lck = model.lck;
	this.cor = model.cor;
	
	this.vitality = model.hp.vitality;
	this.eff_vitality = model.hp.eff_vita;
	this.max_vitality = model.hp.max_vita;
	
	this.stamina = model.hp.stamina;
	this.eff_stamina = model.hp.eff_stm;
	this.max_stamina = model.hp.max_stm;
	
	this.force = model.hp.force;
	this.eff_force = model.hp.eff_force;
	this.max_force = model.hp.max_force;
	
	this.water = model.hp.water;
	this.max_water = model.hp.max_water;
	this.food = model.hp.food;
	this.max_food = model.hp.max_food;
	
	this.start_room = model.startroom;
	if (model.kvs)
		this.kv_flags = model.kvs;
	
	this.interactive = 1;
	this.quests = {};
	this.quest_kills = {};
	
	this.msg_classes = new Array('fail', 'hp', 'room', 'interactive', 'confirm', 'status');
	
	socket.player = this;
    socket.on('cmd', function(arg) {
    	if (!arg || !arg.cmd)
    		return;
    	
        CMD.exec(socket.player, arg.cmd, arg.arg);
    });
    socket.on('disconnect', function() {
    	if (socket.player)
    		socket.player.onDisconnected();
    });
    
    this.set_heart_beat(1);
}, Char);

Player.prototype.onDisconnected = function() {
	console.log('user disconnected');
	this.interactive = 0;
	this.disable_player('<断线中>');
}

Player.prototype.is_player = function() {
	return 1;
}

Player.prototype.recv_message = function(msgclz, msg) {
	if (this.query_tmp('block_msg/all'))
		return;
	
	//TODO this is just a temporary solution
	if (!msgclz || this.msg_classes.indexOf(msgclz) < 0)
		msgclz = 'resp';
	
	if (this.socket)
		this.socket.emit(msgclz, msg);
}

Player.prototype.is_interactive = function() {
	return this.interactive;
}

Player.prototype.is_newbie = function() {
	return 0;
}

Player.prototype.other_login = function(socket) {
	console.log("kick others");
	FUNCTIONS.notify_fail(this, "有人从其它地方登录了此角色。");
	this.socket.player = null;
	this.socket.disconnect();
	
	this.socket = socket;

	socket.player = this;
	this.interactive = 1;
	this.enable_player();
    socket.on('cmd', function(arg) {
    	if (!arg || !arg.cmd)
    		return;
    	
        CMD.exec(socket.player, arg.cmd, arg.arg);
    });
    socket.on('disconnect', function() {
    	if (socket.player)
    		socket.player.onDisconnected();
    });
}

Player.prototype.save_status = function() {
	_daemons.playerd.save_status(this);
}


module.exports = Player;