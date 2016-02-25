var fm = require('framework')
	path = require('path');

var master = fm.extend(function() {
	if (!(this instanceof master))
		return new master();

	this.look_type = "master";
	this.lessons = {};

	this.setup();
}, fm.NPC);

/**
 * Add a skill to this master's lessons collection.
 * @param skill skill's mudos id
 * @param condition json object or function
 * @param cost	json object or function
 */
master.prototype.add_lesson = function(skill, condition, cost) {
	var name = null;
	if (fm.SKILLS.base_skill[skill])
		name = fm.SKILLS.base_skill[skill];
	if (!name && _objs.skills[skill])
		name = _objs.skills[skill].name;
	
	if (!name)
		return;
	
	this.lessons[skill] = {
			name : name,  
			condition : condition,
			cost : cost
	}
}

master.prototype.valid_learn = function(who, skill) {
	if (!this.lessons[skill]) {
		FUNCTIONS.notify_fail(who, _daemons.rankd.gender_pronouce(this) + 
			"并不会这项技能。");
		return 0;
	}
	
	if (typeof this.lessons[skill].condition === 'function') {
		return this.lessons[skill].condition(who);
	} else {
		return this.check_condition(who, this.lessons[skill].condition);
	}
	
	//TODO check cost
}

master.prototype.teach_skill = function(who, skill) {
	if (!this.valid_learn(who, skill))
		return;
	
	_daemons.skilld.skill_taught(this, who, skill);
}

master.prototype.list_lessons = function() {
	var ret = {};
	for (var skill in this.lessons) {
		ret[skill] = {
				skill : { name : this.lessons[skill].name}
		}
	}
	return ret;
}

module.exports = master;