var fm = require('framework');

var kedaxia = fm.extend(function() {
	if (!(this instanceof kedaxia))
		return new kedaxia();
	
	this.name = "珂大侠";
	this.skills = {
			dodge : {
				lv : 100
			},
			parry : {
				lv : 100
			}
	}
	
}, fm.NPC);

module.exports = kedaxia;