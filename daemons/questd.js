var fm = require('framework');

var questd = function() {
	if (!(this instanceof questd))
		return new questd();
}

questd.prototype.setup_publisher = function(p) {
	if (!p || !p.quests)
		return;
	
	for (var k in p.quests) {
		p.quests[k].id = this.get_quest_id(p, p.quests[k]);
	}
}

questd.prototype.accept_quest = function(publisher, player, quest) {
	var desc = quest.desc || "";
	desc = desc.replace('$count$', quest.count + "");
	
	player.quests[quest.id] = quest;
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

questd.prototype.quest_kill = function(who) {
	if (!who || who.is_player())  //player could not be a quest's target
		return;
	
	var murder = who.query_tmp('last_damage_from');
	if (!murder || !(murder instanceof fm.CHAR) || !murder.is_player())
		return;
	
	var id = FUNCTIONS.origin_id(who.id);
	if (murder.quest_kills[id])
		if (murder.quest_kills[id].progress < murder.quest_kills[id].total) {
			murder.quest_kills[id].progress++;
            logger.info("[QuestD] " + murder.id + "'s quest_kill '" + id + "' progress " + murder.quest_kills[id].progress + "/" + murder.quest_kills[id].total);
		}
}

questd.prototype.quest_reward = function(publisher, player, quest) {
	//TODO 
	for (var k in quest.reward) {
		switch (k) {
		case 'martial_exp':
			FUNCTIONS.tell_object(player, "$(WHT)你获得了" + quest.reward[k] + "点武学经验。$NOR");
			break;
		case 'social_exp':
			FUNCTIONS.tell_object(player, "$(WHT)你获得了" + quest.reward[k] + "点江湖阅历。$NOR");
			break;
		case 'money':
			FUNCTIONS.tell_object(player, "$(WHT)你获得了" + quest.reward[k] + "点金钱。$NOR");
			break;
		case 'item':
			break;
		}
	}
}

module.exports = questd;
