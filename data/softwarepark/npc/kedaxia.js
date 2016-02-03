var fm = require('framework');

var kedaxia = fm.extend(function() {
	if (!(this instanceof kedaxia))
		return new kedaxia();
	
	this.name = "珂大侠";
	this.equip_skill('dodge', 100);
	this.equip_skill('parry', 100);
	this.equip_skill('unarmed', 100);
	
}, fm.NPC);

module.exports = kedaxia;