var extend = require('./oo.js'),
	fm = require('framework'),
	MObject = require('./mobject.js');

var Character = extend(function() {
	if (!(this instanceof Character))
		return new Character();
	
	this.str = 10;	//strength
	this.con = 10;	//constitution
	this.int = 10;	//intelligence
	this.apc = 10;	//apperance
	this.lck = 10;	//luck
	this.cor = 10;	//courage
	
	this.vitality = 100;
	this.eff_vitality = 100;	
	this.max_vitality = 100; 
	this.force = 0;
	this.eff_force = 0;
	this.max_force = 0;
	
	this.busy = 0;
	
	this.enemy = new Array();
	this.killer = new Array();
	
	this.skills = {};
	
	this.wimpy_ratio = 50;
	this.tmps = {};
	this.equipments = {};
	
	this.enable_player();
	console.log(this.name + " living is " + this.living());
}
, MObject);

Character.prototype.is_character = function() {
	return 1;
}

Character.prototype.is_player = function() {
	return 0;
}

Character.prototype.enable_player = function() {
	//TODO do more works here, set path for each char
	this.enable_commands();
}


Character.prototype.enable_commands = function() {
	this.flags |= FLAGS.O_ENABLE_COMMANDS;
}

Character.prototype.disable_commands = function() {
	this.flags &= ~FLAGS.O_ENABLE_COMMANDS;
}

Character.prototype.heart_beat = function() {
	if (!FUNCTIONS.environment(this))	// if char is not in a container, skip heart_beat
		return;
	
	if (this.eff_vitality < 0) {
		//TODO quest kill
		this.remove_all_enemy();
		this.die();
		return;
	}
	
	if (this.vitality < 0) {
		//TODO quest kill
		remove_all_enemy();
		if (!this.living()) 
			this.die();
		else
			this.unconcious();
		return;
	}
	
	if (this.is_busy() || !this.could_move()) {
		this.continue_action();
	} else {
		if (this.is_fighting()) {
//			this.do_flee();
		}
		this.attack();
	}
	
	//TODO heal, update age, idle and so on.
}

Character.prototype.fight = function(target) {
	if (!target || target === this || !(this instanceof MObject))
		return;
	
	if (!target.living() || !FUNCTIONS.present(target, FUNCTIONS.environment(this)))
		return;
	
	if (this.is_fighting(target))
		return;
	
	this.enemy.push(target.id);
	this.set_heart_beat(1);
}

Character.prototype.is_fighting = function(target) {
	if (!target)
		return (this.enemy.length > 0);
	
	if (typeof target === 'string') {
		for (var en in this.enemy)
			if (en === target)
				return 1;
	} else if (target instanceof MObject) {
		return this.is_fighting(target.id);
	}
	return 0;
}

Character.prototype.is_killing = function(id) {
	if (!id)
		return (this.killer.length > 0);
	
	if (this.killer.indexOf(id) != -1)
		return 1;
	
	return 0;
}

Character.prototype.could_move = function() {
	//TODO make some flag to limit user's move
	return 1;
}

Character.prototype.is_busy = function() {
	return this.busy != 0;
}

Character.prototype.start_busy = function(new_busy) {
	if (new_busy <= 0)
		return;
	this.busy = new_busy;
	this.set_heart_beat(1);
}

Character.prototype.continue_action = function() {
	if (this.busy > 0) {
		this.busy --;
		return;
	}
}

Character.prototype.die = function() {
	
}

Character.prototype.attack = function() {
	this.clean_up_enemy();
	
	if (this.enemy.length > 0) {
		//TODO player could set a main attacking target.
		var en = this.enemy[FUNCTIONS.random(this.enemy.length)]; 
		_daemons.combatd.fight(this, FUNCTIONS.present(en, FUNCTIONS.environment(this)));
	}
}

Character.prototype.unconcious = function() {
	
}

Character.prototype.remove_all_enemy = function() {
	while (this.enemy.length > 0) {
		var en = this.enemy.shift();
		if (en instanceof Character)
			en.remove_enemy(this);
	}
}

Character.prototype.clean_up_enemy = function() {
	if (this.enemy.length == 0)
		return;
	
	var new_enemy = new Array();
	while (this.enemy.length > 0) {
		var en = this.enemy.shift();
		var env = FUNCTIONS.environment(this);
		if (!en || !(en = FUNCTIONS.present(en, env)) || !(en instanceof Character))
			continue;
		
		if (FUNCTIONS.environment(en) != env 
				|| (!en.living() && !this.is_killing(en.id)))
			en.remove_enemy(this);
		else
			new_enemy.push(en);
	}
	this.enemy = new_enemy;
}

Character.prototype.remove_enemy = function(ob) {
	if (this.enemy.length == 0 || !ob || !(ob instanceof Character))
		return;
	
	var new_enemy = new Array();
	while (this.enemy.length > 0) {
		var en = this.enemy.shift();
		if (!en || en === ob.id)
			continue;
		
		new_enemy.push(en);
	}
	this.enemy = new_enemy;
}

Character.prototype.command = function(cmd, arg) {
	fm.CMD.exec(this, cmd, arg);
}

module.exports = Character;