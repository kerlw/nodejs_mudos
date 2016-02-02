var fm = require('framework');

var corpse = fm.extend(function() {
	"use strict"
	
	this.name = "无名尸体";
	this.desc = "这是一具无名尸体";
	
	if (this instanceof fm.MObject)
		this.call_out("decay", 120, 1);
}, fm.ITEM);

corpse.prototype.decay = function(phase) {
	switch(phase) {
		case 1:
			FUNCTIONS.say(this, this.name + "开始腐烂了，发出一股难闻的恶臭。");
			switch(this.gender) {
				case "男性":
					this.name = "腐烂的男尸";
				case "女性":
					this.name = "腐烂的女尸";
				default:
					this.name = "腐烂的尸体";
			}
			this.desc = "这具尸体显然已经躺在这里有一段时间了，正散发着一股腐尸的味道。\n"; 
			this.call_out("decay", 120, phase + 1);
			break;
		case 2:
			FUNCTIONS.say(this, this.name + "被风吹干了，变成一具骸骨。\n" );
			this.name = "一具枯干的骸骨";
			this.desc = "这副骸骨已经躺在这里很久了。\n";
			this.is_skeleton = 1;
			this.call_out("decay", 60, phase + 1);
			break;
		case 3:
			FUNCTIONS.say(this,  "一阵风吹过，把" + this.name + "化成骨灰吹散了。\n");
			var env = FUNCTIONS.environment(this);
			if(env) {
				//
//				inv = all_inventory(this_object());
//				for(var i = 0; i < inv.length; i++) {
//				    inv[i].move_to(env);
//				}
			}
			FUNCTIONS.destruct(this);
			break;
	}
}

module.exports = corpse;
