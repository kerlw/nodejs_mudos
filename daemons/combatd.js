module.exports = combatd;

function combatd() {
	if (!(this instanceof combatd))
		return new combatd();
}
var TYPE_QUICK = 1;
var TYPE_REGULAR = 2;

var BASIC_ATTACK_SKILL = 'unarmed';

var defence_msg = new Array(
	"$N注视著$n的行动，企图寻找机会出手。",
    "$N正盯著$n的一举一动，随时准备发动攻势。",
    "$N缓缓地移动脚步，想要找出$n的破绽。",
    "$N目不转睛地盯著$n的动作，寻找进攻的最佳时机。",
    "$N慢慢地移动著脚步，伺机出手。");

var catch_hunt_msg = new Array(
    "$N和$n仇人相见分外眼红，立刻打了起来！",
    "$N对著$n一声大喝，蓦地直冲过来！",
    "$N和$n一碰面，二话不说就打了起来！",
    "$N一眼瞥见$n，「哼」的一声冲了过来！");

var winner_msg = new Array(
    "$N哈哈大笑，说道：承让了！",
    "$N双手一拱，笑著说道：承让！",
    "$N胜了这招，向后跃开三尺，笑道：承让！",
    "$N双手一拱，笑著说道：知道我的厉害了吧！",
    "$n向后退了几步，说道：这场比试算我输了，下回看我怎么收拾你！",
    "$n向后一纵，恨恨地说道：君子报仇，十年不晚！",
    "$n脸色一寒，说道：算了算了，就当是我让你吧！",
    "$n纵声而笑，叫道：“你运气好！你运气好！”一面身子向后跳开。",
    "$n脸色微变，说道：佩服，佩服！",
    "$n向后退了几步，说道：这场比试算我输了，佩服，佩服！",
    "$n向后一纵，躬身做揖说道：阁下武艺不凡，果然高明！");

combatd.prototype.eff_status_msg = function(ratio) {
        if (ratio==100) return "看起来气血充盈，并没有受伤。";
        if (ratio > 95) return "似乎受了点轻伤，不过光从外表看不大出来。";
        if (ratio > 90) return "看起来可能受了点轻伤。";
        if (ratio > 80) return "受了几处伤，不过似乎并不碍事。";
        if (ratio > 60) return "受伤不轻，看起来状况并不太好。";
        if (ratio > 40) return "气息粗重，动作开始散乱，看来所受的伤著实不轻。";
        if (ratio > 30) return "已经伤痕累累，正在勉力支撑著不倒下去。";
        if (ratio > 20) return "受了相当重的伤，只怕会有生命危险。";
        if (ratio > 10) return "伤重之下已经难以支撑，眼看就要倒在地上。";
        if (ratio > 5 ) return "受伤过重，已经奄奄一息，命在旦夕了。";
        return "受伤过重，已经有如风中残烛，随时都可能断气。";
}

combatd.prototype.status_msg = function(ratio) {
        if (ratio==100) return "看起来充满活力，一点也不累。";
        if (ratio > 95) return "似乎有些疲惫，但是仍然十分有活力。";
        if (ratio > 90) return "看起来可能有些累了。";
        if (ratio > 80) return "动作似乎有点不太灵光，但仍然有条不紊。";
        if (ratio > 60) return "气喘嘘嘘，看起来状况并不太好。";
        if (ratio > 40) return "似乎十分疲惫，看来需要好好休息了。";
        if (ratio > 30) return "招架已然散乱，正勉力支撑著不倒下去。";
        if (ratio > 20) return "看起来已经力不从心了。";
        if (ratio > 10) return "歪歪斜斜地站都站立不稳，眼看就要倒地。";
        return "已经陷入半昏迷状态，随时都可能摔倒晕去。";
}

combatd.prototype.announce = function(ob, event) {
	switch (event) {
		case "dead":
			FUNCTIONS.message_vision("\n$N「啪」的一声倒在地上，挣扎着抽动了几下就死了。\n\n", ob);
			break;
		case "unconcious":
			if (ob.race != "人类")
				FUNCTIONS.message_vision("\n$N挣扎了几下，一个不稳晕倒过去。\n\n", ob);
			else 
				FUNCTIONS.message_vision("\n$N神志迷糊，脚下一个不稳，倒在地上昏了过去。\n\n", ob);
			break;
		case "revive":
			if (ob.blind || ob.race != "人类")
				FUNCTIONS.message_vision("\n$N身子一颤，扭动了几下，清醒了过来。\n\n", ob);
			else if(ob.mute)
				FUNCTIONS.message_vision("\n$N慢慢清醒了过来，睁开眼睛站起来摇了摇头。\n\n", ob);
			else 
				FUNCTIONS.message_vision("\n$N身子动了动，口中呻吟了几声，清醒过来。\n\n", ob);
	}
}

combatd.prototype.do_attack = function(me, other, weapon, type) {
	if (!me || !other || FUNCTIONS.environment(me) !== FUNCTIONS.environment(other))
		return 0;
	
	if (!me.living() || me.is_busy() && !other.is_busy())
		return 0;
	
	var base_attack_skill = null;
	if (weapon) {
		base_attack_skill = weapon.skill_type;
	}
	if (!base_attack_skill)
		base_attack_skill = BASIC_ATTACK_SKILL;

    logger.debug("[CombatD] do attack me=" + me.name + " basic_attack_skill = " + base_attack_skill);
	var attack_skill = this.find_skill_to_use(me, base_attack_skill, other);
    logger.debug("             attack_skill = " + attack_skill.name);
	
	//1. other may dodge, and if dodged, other may beat back.
	var dodge = 1;
	if (other.skills.dodge)
		dodge = other.skills.dodge.lv;
	if (Math.random() <= dodge * 3 / 2000) {
		FUNCTIONS.message_combatd("$n躲开了$N的攻击.", me, other);
		//TODO dodged, calc beat back.
		return 1;
	}
	
	//2. if not dodged, other may parry
	var parry = 1;
	if (other.skills.parry)
		parry = other.skills.parry.lv;
	if (Math.random() <= parry * 3 / 2000) {
		//parried
		FUNCTIONS.message_combatd("$n招架住了$N的攻击.", me, other);
		return 1;
	}
	
	//3. if not parried either, OK, it's time to decide damage.
	var lvl = me.query_skill(attack_skill.name, 1);
	var action = _daemons.skilld.query_action(me, attack_skill, lvl, other);
	var cost = _daemons.skilld.query_cost(me, attack_skill, lvl, other);
	var damage = _daemons.skilld.query_damage(me, attack_skill, lvl, other);
	me.recv_damage(cost);
	other.recv_damage(damage, me);
	FUNCTIONS.message_combatd(action, me, other);
	
	//if (damage > 0) {
		if (other.vitality*3 <= other.max_vitality
				&& !me.is_killing(other.id) && !other.is_killing(me.id)) {
			me.remove_enemy(other);
			other.remove_enemy(me);
			FUNCTIONS.message_vision(winner_msg[FUNCTIONS.random(winner_msg.length)], me, other);
		}
	//}
	return 1;
}

combatd.prototype.fight = function(me, other) {
    logger.debug("[CombatD] " + me.id + " fight " + other.id);
	if (!me.living())
		return;
	
	var weapon = me.equipments.weapon;
	//if other is busy or unconcious, always take chance to do attack
	if (other.is_busy() || !other.living()) {
		me.tmps.defending = 0;
		if (!other.is_fighting(me)) 
			 other.fight(me);
		this.do_attack(me, other, weapon, TYPE_QUICK);
		//TODO double attack
	} else if (me.tmps.defending || me.cor > other.cor * 4 * Math.random() / 3) {
		me.tmps.defending = 0;
		if (!other.is_fighting(me)) 
			 other.fight(me);
		this.do_attack(me, other, weapon, TYPE_REGULAR);
		//TODO double attack
	} else {
		me.tmps.defending = 1;
		FUNCTIONS.message_combatd(defence_msg[FUNCTIONS.random(defence_msg.length)], me, other);
	}
}

combatd.prototype.auto_fight = function(me, other, type) {
	if (!me.is_player() && !other.is_player())	// don't let two npc auto fight
		return;
	
	if (me.query_tmp("looking_for_trouble"))
		return;
	me.set_tmp("looking_for_trouble", 1);
	
	//TODO use an asyn/delay call to give 'other' a chance to slip trough the fierce guys.
	this.hunting(me, other, type);
}

combatd.prototype.hunting = function(me, other, type) {
	if (!me || !other)
		return;
	
	me.del_tmp("looking_for_trouble");
	if (me.is_killing(other.id) && me.is_fighting(other.id) || !me.living())
		return;
	
	var env = FUNCTIONS.environment(me);
	if (env.query("sleep_room") || env.query("no_fight"))
		return;
	
	if (env != FUNCTIONS.environment(other)) {
		//TODO start_hatred
		return;
	}
	
	switch (type) {
	case "hatred":
		me.kill(other);
		break;
	}
	
}

combatd.prototype.find_skill_to_use = function(me, skill, other) {
	var attack_skill = BASIC_ATTACK_SKILL;
	if (!skill)
		skill = BASIC_ATTACK_SKILL;
	
	if (me.skills[skill] && me.skills[skill].spec) {
		attack_skill = me.skills[skill].spec;
	}

	if (!_objs.skills[attack_skill]) {
        logger.error("[CombatD] unknown attack_skill (" + attack_skill + ") in combatd:skill_damage "
				+ me.id + " vs " + other.id);
		attack_skill = BASIC_ATTACK_SKILL;
	}
	
	var ret = _objs.skills[attack_skill];
	if (ret.valid_use(me))
		return ret;
	
	return _objs.skills[BASIC_ATTACK_SKILL];
}

combatd.prototype.basic_attack_skill_damage = function(me, other) {
	return 100;
}

combatd.prototype.skill_power = function(who, skill, usage) {
	if (!who || !(who instanceof fm.CHAR) || !who.living())
		return 0;
	
}

combatd.prototype.make_corpse = function(whose, killer) {
	var corpse = new _std.corpse();
	corpse.name = whose.name + "的尸体";
	corpse.desc = whose.desc + "然而，" +  _daemons.rankd.gender_pronoun(whose) + 
				"已经死了，只剩下一具尸体静静地躺在这里。\n";
	var id = "corpse#" + whose.id + "#", index = 0;
	while (_objs.items[id + index]) {
		index++;
	}
	id += index;
	corpse.id = id;
	_objs.items[id] = corpse;
	corpse.move_to(FUNCTIONS.environment(whose));
	
	//TODO items on this corpse
	return corpse;
}
