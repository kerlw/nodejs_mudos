var extend = require('./oo.js'),
	fm = require('framework'),
	MObject = require('./mobject.js'),
	BASE_SKILL = require('./skill.js').base_skills;

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
	
	this.stamina = 100;
	this.eff_stamina = 100;
	this.max_stamina = 100;
	
	this.force = 0;
	this.eff_force = 0;
	this.max_force = 0;
	
	this.busy = 0;
	
	this.enemy = new Array();
	this.killer = new Array();
	
	this.skills = {};
	
	this.wimpy_ratio = 0;
	this.equipments = {};
	this.ghost = 0;
	
	this.enable_player();
}
, MObject);

Character.prototype.is_character = function() {
	return 1;
}

Character.prototype.is_player = function() {
	return 0;
}

Character.prototype.display_name = function() {
	if (this.disable_type)
		return this.name + this.disable_type;
	else
		return this.name;
}

Character.prototype.enable_player = function() {
	//TODO do more works here, set path for each char
	delete this.disable_type;
	this.enable_commands();
}

Character.prototype.disable_player = function(reason) {
	this.disable_commands();
	this.disable_type = reason;
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
		this.remove_all_enemy();
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
	
	if ((this.cnd_flags & CND_FLAGS.CND_NO_HEAL_UP) == 0)
		this.heal_up();
	
	//TODO heal, update age, idle and so on.
}

Character.prototype.fight = function(target) {
	if (!target || target === this || !(target instanceof MObject))
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
		for (var i = 0; i < this.enemy.length; i++)
			if (this.enemy[i] === target)
				return 1;
	} else if (target instanceof MObject) {
		return this.is_fighting(target.id);
	}
	return 0;
}

Character.prototype.kill = function(target) {
	if (!target || target === this || !(target instanceof MObject))
		return;
	
	if (!this.is_killing(target.id))
		this.killer.push(target.id);
	
	this.fight(target);
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
	var env = FUNCTIONS.environment(this);
	if (env && env.alternative_die && typeof env.alternative_die === 'function')
		return env.alternative_die(this);
	
	if (!this.living())
		this.revive(1);	//make 'me' revive in quiet mode, nor 'me' could not get dead annouce msg
	
	if (this.is_ghost())
		return;
	
	if (this.is_busy())
		this.interrupt_me();
	
	_daemons.combatd.announce(this, "dead");
	//TODO add killer to make_corpse
	var corpse = _daemons.combatd.make_corpse(this);
	corpse.move_to(env);
	
	this.remove_all_killer();
	
	if (this.is_player()) {
		this.ghost = 1;
		this.vitality = 1;
		this.eff_vitality = 1;
		this.stamina = 1;
		this.eff_stamina = 1;
		
//		this.move_to(DEATH_ROOM);
		
	} else {
		FUNCTIONS.destruct(this);
	}
}

Character.prototype.interrupt_me = function(who) {
	
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
	if (!this.living())
		return;
	
	this.remove_all_enemy();
	FUNCTIONS.tell_object(this, "HIR \n你只觉得头昏脑胀，眼前一黑，接着什么也不知道了……\n\n NOR");
	this.command("hp");
	this.disable_player("<昏迷不醒>");
	this.set_tmp("block_msg/all", 1);
	
	_daemons.combatd.announce(this, "unconcious");
	
	this.call_out("revive", (30 + FUNCTIONS.random(60 - this.con)));
}

Character.prototype.revive = function(quiet) {
	this.remove_call_out("revive");
	
	this.enable_player();
	var env = FUNCTIONS.environment(this);
	if (env && env instanceof Character)
		this.move_to(FUNCTIONS.environment(env));
	
	this.del_tmp("block_msg/all");
	
	if (!quiet) {
		_daemons.combatd.announce(this, "revive");
		FUNCTIONS.tell_object(this, "HIY \n一股暖流发自丹田流向全身，慢慢地你又恢复了知觉……\n\n NOR");
		this.command("hp");
	}
}

Character.prototype.remove_all_killer = function() {
	this.killer = new Array();
	while (this.enemy.length > 0) {
		var en = this.enemy.shift();
		var env = FUNCTIONS.environment(this);
		if (!en || !(en = FUNCTIONS.present(en, env)) || !(en instanceof Character))
			continue;
		
		en.remove_killer(this);
	}
}

Character.prototype.remove_all_enemy = function() {
	while (this.enemy.length > 0) {
		var en = this.enemy.shift();
		var env = FUNCTIONS.environment(this);
		if (!en || !(en = FUNCTIONS.present(en, env)) || !(en instanceof Character))
			continue;
		
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
			new_enemy.push(en.id);
	}
	this.enemy = new_enemy;
}

Character.prototype.remove_killer = function(ob) {
	if (this.enemy.length == 0 || !ob || !(ob instanceof Character))
		return;
	
	delete this.killer[ob.id];
	this.remove_enemy(ob);
}

Character.prototype.remove_enemy = function(ob) {
	if (this.enemy.length == 0 || !ob || !(ob instanceof Character))
		return;
	
	var new_enemy = new Array();
	while (this.enemy.length > 0) {
		var en = this.enemy.shift();
		if (!en || en == ob.id) {
			continue;
		}
		
		new_enemy.push(en);
	}
	this.enemy = new_enemy;
}

Character.prototype.command = function(cmd, arg) {
	fm.CMD.exec(this, cmd, arg);
}

Character.prototype.recv_damage = function(type, damage, who) {
	if (type != "vitality" && type != "force")
		throw "unkonw type of damage received." + type;
	
	var val = this[type] - damage;
	if (val < 0)
		val = -1;
	
	this[type] = val;
	
	if (this.is_player())
		this.command('hp');
}

Character.prototype.is_ghost = function() {
	return this.ghost;
}

Character.prototype.is_corpse = function() {
	return 0;
}

Character.prototype.heal_up = function() {
	if (this.is_ghost())
		return 0;
	
	var env = FUNCTIONS.environment(this);
	if (!env || env.query_tmp('no_update'))
		return 0;
	
	if (this.is_fighting() || this.query_tmp('disallow_heal_up'))
		return 0;
	
	var ret = 0;
	if (this.water > 0) {
		this.water--;
		ret++;
	}
	if (this.food > 0) {
		this.food--;
		ret++;
	}
	
	if (this.is_busy())
		return ret;
	
	if (this.is_player() && this.water < 1)
		return ret;
	
	this.vitality += Math.floor(this.con / 3 + this.force / 100);
	if (this.vitality >= this.eff_vitality) {
		this.vitality = this.eff_vitality;
		if (this.eff_vitality < this.max_vitality) {
			this.eff_vitality++;
			ret++;
		}
	} else 
		ret++;
	
	if (this.max_force > 0 && this.force < this.max_force) {
		this.force += 1 + Math.floor(this.skills.force / 100);
		if (this.force > this.max_force) {
			this.force = this.max_force;
			ret++;
		}
	} else
		ret++;
	
	if (this.is_player() && this.food < 1)
		return ret;
	
	this.stamina += Math.floor(this.con / 3);
	if (this.skills.force)
		this.stamina += Math.floor(this.skills.force.lv / 10);
	if (this.stamina >= this.eff_stamina) {
		this.stamina = this.eff_stamina;
		if (this.eff_stamina < this.max_stamina) {
			this.eff_stamina++;
			ret++;
		}
	} else 
		ret++;
	
	return ret;
}

Character.prototype.equip_skill = function(skill_name, lv) {
	if (!BASE_SKILL[skill_name] && !_objs.skills[skill_name]) {
		console.log("[ERROR] Unknown skill_name '" + skill_name + "' specified for Character:equip_skill.");
		return;
	}
	
	this.skills[skill_name] = {	lv: lv };
}

Character.prototype.enable_skill = function(base, special) {
	if (!BASE_SKILL[base]) {
		console.log("[ERROR] Unknown base skill specified.")
		return;
	}
	
	if (!_objs.skills[special]) {
		console.log("[ERROR] Unknown special skill specified.");
		return;
	}
	
	if (!this.skills[base]) {
		if (this.is_player())
			FUNCTIONS.notify_fail(this, "你还不会「" + BASE_SKILL[base] + "」这项技能。");
		//TODO add log here to log exceptions 
		return;	
	}
	
	if (!this.skills[special]) {
		if (this.is_player())
			FUNCTIONS.notify_fail(this, "你还不会「" + _objs.skills[special].name + "」这项技能。");
		//TODO add log here to log exceptions
		return;
	}
	
	//TODO check skill's enable conditions
	this.skills[base].spec = special;
} 

module.exports = Character;