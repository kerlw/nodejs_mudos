var fm = require('framework');

var taijiquan = fm.extend(function() {
	if (!(this instanceof taijiquan))
		return new taijiquan();
	
	this.name = 'taijiquan';
	this.base_type = 'unarmed';
}, fm.SKILL);

//taijiquan.prototype.valid_use = function(me, use_lv) {
//	
//}

taijiquan.prototype.action = function(me, use_lv, other) {
	if (!this.valid_use(me, use_lv))
		throw this.name + "(" + use_lv + ") could not be used by " + me.id;
	
	switch (use_lv) {
	case 1:
		return 'N使出「粘」字诀，拳招陡然花俏，似在作弄$n，却又暗伏后招！';
	case 2:
		return '$N使出「缠」字诀，单拳缓缓击出，不偏不倚，虽是指向正中，拳力却将$n的周身笼住！';
	default:
		return '$N使出「梦」字诀，拳势如梦，又在半梦半醒，$n一时神弛，拳风已然及体！';	
	}
}

taijiquan.prototype.cost = function(me, use_lv) {
	return {'force': 10}; 
}


taijiquan.prototype.damage = function(me, use_lv, other) {
	if (!me.skills['taijiquan']) {
		return null;
	}

	return {'vitality' : 20};
}

module.exports = taijiquan;