var fm = require('framework');

var unarmed = fm.extend(function() {
	if (!(this instanceof unarmed))
		return new unarmed();
	
	this.name = "unarmed";
}, fm.SKILL);

unarmed.prototype.action = function(me, lv, other) {
	return "$N击中了$n";
}

unarmed.prototype.damage = function(me, lv, other) {
	return new Array({'vitality' : 10 + FUNCTIONS.random(me.str)});
}

module.exports = unarmed;