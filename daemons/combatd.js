module.exports = combatd;

function combatd() {
	if (!(this instanceof combatd))
		return new combatd();
}
var TYPE_QUICK = 1;
var TYPE_REGULAR = 2;
var guard_msg = new Array(
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
    "$N双手一拱，笑著说道：知道我的利害了吧！",
    "$n向后退了几步，说道：这场比试算我输了，下回看我怎么收拾你！",
    "$n向后一纵，恨恨地说道：君子报仇，十年不晚！",
    "$n脸色一寒，说道：算了算了，就当是我让你吧！",
    "$n纵声而笑，叫道：“你运气好！你运气好！”一面身子向后跳开。",
    "$n脸色微变，说道：佩服，佩服！",
    "$n向后退了几步，说道：这场比试算我输了，佩服，佩服！",
    "$n向后一纵，躬身做揖说道：阁下武艺不凡，果然高明！");

combatd.prototype.do_attack = function(me, other, weapon, type) {
	if (!me || !other || FUNCTIONS.environment(me) !== FUNCTIONS.environment(other))
		return 0;
	
	if (!me.living() || me.is_busy() && !other.is_busy())
		return 0;
	
	//1. other may dodge, and if dodged, other may beat back.
	var dodge = 1;
	if (other.skills.dodge)
		dodge = other.skills.dodge.lv;
	if (Math.random() <= dodge / 300) {
		FUNCTIONS.message_combatd("$n躲开了$N的攻击.", me, other);
		//TODO dodged, calc beat back.
		return 1;
	}
	
	//2. if not dodged, other may parry
	var parry = 1;
	if (other.skills.parry)
		parry = other.skills.parry.lv;
	if (Math.random() <= parry / 300) {
		//parried
		FUNCTIONS.message_combatd("$n招架住了$N的攻击.", me, other);
		return 1;
	}
	
	//3. if not parried either, OK, it's time to decide damage.
	FUNCTIONS.message_combatd("$N击中了$n", me, other);
	return 1;
}

combatd.prototype.fight = function(me, other) {
	if (!me.living() || !other.living())
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
		FUNCTIONS.message_combatd(guard_msg[FUNCTIONS.random(guard_msg.length)], me, other);
	}
}
