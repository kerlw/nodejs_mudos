module.exports = combatd;

function combatd() {
	
}

combatd.prototype.do_attack(me, other) {
	if (!me || !other || Functions.environment(me) !== Functions.environment(other))
		return 0;
	
	if (!me.living() || me.is_busy() && other.is_busy())
		return 0;
	
	
}

combatd.prototype.fight(me, other) {
	if (!me.living() || !other.living())
		return;
	
	this.do_attack(me, other);
}
