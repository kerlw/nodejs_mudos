module.exports = combatd;

function combatd() {
	
}

combatd.prototype.do_attack = function(me, other) {
	if (!me || !other || FUNCTIONS.environment(me) !== FUNCTIONS.environment(other))
		return 0;
	
	if (!me.living() || me.is_busy() && !other.is_busy())
		return 0;
	
	//1. other may dodge, and if dodged, other may beat back.
	var dodge = 0;
	if (other.skills.dodge)
		dodge = other.skills.dodge.lv;
	if (Math.random() * 100 <= dodge / 200) {
		FUNCTIONS.message_combatd("$n躲开了$N的攻击.", me, other);
		//TODO dodged, calc beat back.
		return 1;
	}
	
	//2. if not dodged, other may parry
	var parry = 0;
	if (other.skills.parry)
		parry = other.skills.parry.lv;
	if (Math.random() * 100 <= parry / 200) {
		//parried
		FUNCTIONS.message_combatd("$n招架住了$N的攻击.", me, other);
		return 1;
	}
	
	//3. if not parried either, OK, it's time to decide damage.
	FUNCTIONS.message_combatd("$N击中了$n", me, other);
	return 1;
}

combatd.prototype.fight = function(me, other) {
	if (!me.living() || !other.living())
		return;
	
	this.do_attack(me, other);
}
