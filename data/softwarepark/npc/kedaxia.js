var fm = require('framework');

var kedaxia = fm.extend(function() {
	if (!(this instanceof kedaxia))
		return new kedaxia();
	
	this.name = "珂大侠";
	
}, fm.NPC);

module.exports = kedaxia;