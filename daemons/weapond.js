module.exports = weapond;

var fm = require('framework');

function weapond() {
}

weapond.weapon_actions = {
		"slash": {
		   		"damage_type":	"割伤",
		   		"action":		"$N挥动$w，斩向$n的$l",
		   		"parry":		20,
		   		},
		   	"slice": {
		   		"damage_type":	"劈伤",
		   		"action":		"$N用$w往$n的$l砍去",
		   		"dodge":		20,
		   		},
		   	"chop":	{
		   		"damage_type":	"劈伤",
		   		"action":		"$N的$w朝着$n的$l劈将过去",
		   		"parry":		-20,
		   		},
		   	"hack":	{
		   		"action":		"$N挥舞$w，对准$n的$l一阵乱砍",
		   		"damage_type":	"劈伤",
		   		"damage":		30,
		   		"dodge":		30,
		   		},
		   	"thrust": {
		   		"damage_type":	"刺伤",
		   		"action":		"$N用$w往$n的$l刺去",
		   		"dodge":		15,
		   		"parry":		-15,
		   		},
		   	"pierce": {
		   		"action":		"$N的$w往$n的$l狠狠地一捅",
		   		"damage_type":	"刺伤",
		   		"dodge":		-30,
		   		"parry":		-30,
		   		},
		   	"whip":	{
		   		"action":		"$N将$w一扬，往$n的$l抽去",
		   		"damage_type":	"拉伤",
		   		"dodge":		-20,
		   		"parry":		30,
		   		},
		   	"impale": {
		   		"action":		"$N用$w往$n的$l直戳过去",
		   		"damage_type":	"刺伤",
		   		"dodge":		-10,
		   		"parry":		-10,
		   		},
		   	"bash":	{
		   		"action":		"$N挥舞$w，往$n的$l用力一砸",
		   		"damage_type":	"砸伤",
		   		},
		   	"crush": {
		   		"action":		"$N高高举起$w，往$n的$l当头砸下",
		   		"damage_type":	"砸伤",
		   		},
		   	"slam":	{
		   		"action":		"$N手握$w，眼露凶光，猛地对准$n的$l挥了过去",
		   		"damage_type":	"挫伤",
		   		},
		   	"throw": {
		   		"action":		"$N将$w对准$n的$l射了过去",
		   		"damage_type":	"刺伤",
		   		"post_action":	weapond.prototype.throw_weapon,
		   		},
}

weapond.prototype.query_action = function(weapon) {
//	if (!weapon || !(weapon instanceof fm.WEAPON))
}

weapond.prototype.throw_weapon = function() {
	
}
