module.exports = skill;

function skill() {
	
}

skill.prototype.valid_learn = function(me, weapon) {
	return 1;
}

skill.prototype.valid_effect = function(me, weapon, action) {
	return 1;
}

/**
 * There are two types of skill: martial, knowledge
 */
skill.prototype.type = function() {
	return 'martial';
}

skill.prototype.skill_improved = function(me) {}
