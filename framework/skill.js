module.exports = skill;

function skill() {
	
}

skill.prototype.valid_learn(me, weapon) {
	return 1;
}

skill.prototype.valid_effect(me, weapon, action) {
	return 1;
}

/**
 * There are two types of skill: martial, knowledge
 */
skill.prototype.type() {
	return 'martial';
}

skill.prototype.skill_improved(me) {}
