var extend = require('./oo.js');
var MObject = require('./mobject.js');

var Character = extend(function() {
	if (!(this instanceof Character))
		return new Character();
	
	this.str = 0;	//strength
	this.con = 0;	//constitution
	this.int = 0;	//intelligence
	this.apc = 0;	//apperance
	this.lck = 0;	//luck
	this.cor = 0;	//courage
	
	this.vitality = 0;
	this.eff_vitality = 0;	
	this.max_vitality = 0; 
	this.force = 0;
	this.max_force = 0;
	
	this.busy = 0;
	
	this.enemy = new Array();
}
, MObject);

Character.prototype.is_character = function() {
	return 1;
}

Character.prototype.is_player = function() {
	return 0;
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
	
	if (!target.living() || !Functions.present(target, Functions.environment(this)))
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
	} else if (target instanceof fm.MObject) {
		return is_fighting(target.id);
	}
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
		var en = this.enemy[Math.floor(Math.random() * 100) % this.enemy.length] 
		_daemons.combat.fight(this, en);
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
		if (!en || !(en instanceof Character)
				|| FUNCTIONS.environment(en) != FUNCTIONS.environment(this)
				|| !this.is_killing(en.id))
			en.remove_enemy(this);
		else
			new_enemy.push(en);
	}
	this.enemy = new_enemy;
}

Character.prototype.remove_enemy = function(ob) {
	if (this.enemy.length == 0)
		return;
	
	var new_enemy = new Array();
	while (this.enemy.length > 0) {
		var en = this.enemy.shift();
		if (!en || en == ob)
			continue;
		new_enemy.push(en);
	}
	this.enemy = new_enemy;
}

module.exports = Character;