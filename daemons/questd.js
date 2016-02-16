var fm = require('framework');

var questd = function() {
	if (!(this instanceof questd))
		return new questd();
}

questd.prototype.quest_desc = function(quest, who) {
	var desc = quest.desc || "";
	desc = desc.replace('$count$', quest.count + "");
	
	return desc;
}

module.exports = questd;
