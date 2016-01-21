

var extend = require('./oo.js');
var MObject = require('./mobject.js');

var Character = extend(function() {
	if (!(this instanceof Character))
		return new Character();
	
	this.str = 0;	//strength
	this.con = 0;	//constitution
	this.int = 0;	//intelligence
	this.apc = 0;	//apperance
	this.lck = 0;	//luck
	this.cor = 0;	//courage
	
	this.vitality = 0;
	this.eff_vitality = 0;	
	this.max_vitality = 0; 
	this.force = 0;
	this.max_force = 0;
}
, MObject);

Character.prototype.is_character = function() {
	return 1;
}

Character.prototype.heart_beat = function() {
	if (!FUNCTIONS.environment(this))	// if char is not in a container, skip heart_beat
		return;
	
}

module.exports = Character;