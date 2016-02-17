var extend = require('./oo.js'),
	NPC = require('./npc.js');

var ANIMAL = extend(function() {
	if (!(this instanceof ANIMAL))
		return new ANIMAL();
	
	this.set_flag('can_speak', 0);
}, NPC);


ANIMAL.prototype.accept_fight = function(who) {
	return 0;
}

module.exports = ANIMAL;