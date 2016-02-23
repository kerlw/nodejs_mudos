var fm = require('framework')
	path = require('path');

var master = fm.extend(function() {
	if (!(this instanceof master))
		return new master();

	this.look_type = "master";
	this.skills_teach = {};

	this.setup();
}, fm.NPC);

/**
 * Add a skill to this master's skills_teach collection.
 * @param skill skill's mudos id
 * @param condition json object or function
 * @param cost	json object or function
 */
master.prototype.add_teach_skill = function(skill, condition, cost) {
	this.skills_teach[skill] = {
			condition : condition,
			cost : cost
	}
}

master.prototype.valid_learn = function(who, skill) {
	if (!this.skills_teach[skill]) {
		FUNCTIONS.notify_fail(who, _daemons.rankd.gender_pronouce(this) + 
			"并不会这项技能。");
		return 0;
	}
	
	if (typeof this.skills_teach[skill].condition === 'function') {
		return this.skills_teach[skill].condition(who);
	} else {
		return this.check_condition(who, this.skills_teach[skill].condition);
	}
}

master.prototype.teach_skill = function(who, skill) {
	if (!valid_learn(who, skill))
		return;
	
	_daemons.skilld.skill_taught(this, who, skill);
}

master.prototype.list_lessons = function() {
	var ret = {};
	return ret;
}

module.exports = master;