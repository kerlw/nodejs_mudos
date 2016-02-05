module.exports = skilld;

function skilld() {
	if (!(this instanceof skilld))
		return new skilld();
}

skilld.prototype.query_action = function(me, skill, lv, other) {
	return skill.action(me, lv, other);
}

skilld.prototype.query_cost = function(me, skill, lv, other) {
	return skill.cost(me, lv, other);
}

skilld.prototype.query_damage = function(me, skill, lv, other) {
	return skill.damage(me, lv, other);
}
