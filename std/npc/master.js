var fm = require('framework')
	path = require('path');

var master = fm.extend(function() {
	if (!(this instanceof master))
		return new master();

	this.look_type = "master";
	this.goods = {};

	this.setup();
}, fm.NPC);

master.prototype.valid_learn = function(who, skill) {
	if (!this.skills[skill])
		return FUNCTIONS.notify_fail(who, _daemons.rankd.gender_pronouce(this) + 
			"并不会这项技能。");

}

master.prototype.teach_skill = function(who, skill) {

}

module.exports = master;