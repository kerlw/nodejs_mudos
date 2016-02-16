var extend = require('./oo.js'),
	Char = require('./character.js'),
	fs = require('fs'),
	path = require ('path');

var NPC = extend(function() {
	if (!(this instanceof NPC))
		return new NPC();
	
	this.wimpy_ratio = 0;	//make npc do not flee as default.
	this.inquiries = {};
}, Char);

NPC.loadFromJSON = function(data) {
	for (var key in data) {
		console.log('key is ' + key + ', value is' + data[key]);
	}
}

NPC.load = function(filename) {
	var data = require(filename);
	return NPC.loadFromJSON(data);
}

NPC.prototype.accept_fight = function(who) {
	if (!who)
		return 0;
	
	var RANK_D = global._daemons.rankd;
	if (this.is_fighting()) {
		if (this.query_flag('can_speak'))
			this.command("say", RANK_D.query_respect(who) + "想要倚多取胜吗?");
		return 0;
	}
	
	if (this.query_flag('can_speak') && this.vitality * 100 / this.max_vitality > 90) {
		this.command("say", "既然" + RANK_D.query_respect(who)
				+ "赐教，" + RANK_D.query_self(this)
				+ "只好奉陪，我们点到为止。");
		return 1;
	}
	return 0;
}

NPC.prototype.return_home = function() {
	var env = FUNCTIONS.environment(this);
	if (!env || env === this.home)
		return 1;

	if (!this.home || !this.living() || this.is_busy() || this.is_fighting())
		return 0;
	
	message("vision", this.name + "急急忙忙的离开了", env, this);
	return this.move_to(this.home);
}

NPC.prototype.chat = function() {
	var chance = this.query(this.is_fighting() ? 
			"chat_chance_combat" : "chat_chance");
	if (!chance)
		return;
}

NPC.prototype.random_move = function() {
	//TODO define nps's move area
}

NPC.prototype.is_vender = function() {
	return 0;
}

NPC.prototype.add_inquiry = function(id, name, callback) {
	this.inquiries[id] = {
			name : name,
			cb : callback,
	}
}

NPC.prototype.do_inquiry = function(who, about) {
	if (!this.inquiries || !this.inquiries[about]) 
		return FUNCTIONS.notify_fail(who, this.name + "向你摇了摇头，看起来并不清楚你要打听的事情。");
	
	if (this.visiable_inquiry 
			&& typeof(this.visiable_inquiry) === 'function'
			&& !this.visiable_inquiry.call(this, about, who))
		return FUNCTIONS.notify_fail(who, this.name + "并不清楚你要打听的事情。");
	
	if (typeof(this.inquiries[about].cb) === 'function')
		this.inquiries[about].cb.call(this, who);
}

NPC.prototype.query_inquiry = function(who) {
	var ret = {};
	if (this.inquiries) {
		for (var k in this.inquiries) {
			if (!this.inquiries[k].name)
				continue;
			
			if (this.visiable_inquiry 
					&& typeof(this.visiable_inquiry) === 'function'
					&& !this.visiable_inquiry.call(this, k, who))
				continue;
				
			ret[k] = this.inquiries[k].name
		}
	}
	return ret;
}

module.exports = NPC;