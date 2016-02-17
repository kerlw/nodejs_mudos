var fm = require('framework');

var kedaxia = fm.extend(function() {
	if (!(this instanceof kedaxia))
		return new kedaxia();
	
	this.name = "珂大侠";
	this.desc = "江湖人称珂大侠";
	this.str = 30;
	this.con = 30;
	this.max_vitality = 100;
	
	this.equip_skill('dodge', 100);
	this.equip_skill('parry', 100);
	this.equip_skill('unarmed', 100);
	this.equip_skill('taijiquan', 100);
	this.enable_skill('unarmed', 'taijiquan');
	
	this.setup_char();
}, fm.NPC);

module.exports = kedaxia;