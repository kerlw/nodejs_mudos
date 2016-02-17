var fm = require('framework');

var questd = function() {
	if (!(this instanceof questd))
		return new questd();
}

questd.prototype.accept_quest = function(publisher, player, quest) {
	var desc = quest.desc || "";
	desc = desc.replace('$count$', quest.count + "");
	
	var quest_id = this.get_quest_id(publisher, quest);
	player.quests[quest_id] = quest;
	if (quest.type === 'kill') {
		player.quest_kills[quest.target] = {
			progress : 0,
			total : quest.count
		}
	} else {
		//TODO
	}
	
	
	if (publisher.query_flag('can_speak'))
		FUNCTIONS.message_vision("$N对$n说到：" + desc, publisher, player);
}

questd.prototype.get_quest_id = function(publisher, quest) {
	return FUNCTIONS.origin_id(publisher.id) + '#' + quest.key;
}

questd.prototype.is_quest_finshed = function(publisher, player, quest) {
	var id = this.get_quest_id(publisher, quest);
	if (!player.quests[id])
		return 0;
	
	if (quest.type === 'kill') {
		if (!player.quest_kills[quest.target] || 
				player.quest_kills[quest.target].progress < player.quest_kills[quest.target].total)
			return 0;
	} else {
		//TODO
	}
	return 1;
}

questd.prototype.quest_kill = function(who, target) {
	var id = FUNCTIONS.origin_id(target.id);
	if (who.quest_kills[id])
		if (who.quest_kills[id].progress < who.quest_kills[id].total)
			who.quest_kills[id].progress++;
}

module.exports = questd;
