module.exports = rankd;

var fm = require('framework');

function rankd() {
	if (!(this instanceof rankd))
		return new rankd();
}

rankd.prototype.assert_char = function(who) {
	if (!(who instanceof fm.CHAR))
		throw "trying to query_rank of a non-char object";
}

rankd.prototype.query_rank = function(who) {
	this.assert_char(who);
	
	if (who.is_ghost())
		return "【 鬼 魂 】";
	
	return "【 平 民 】";
}

rankd.prototype.query_self = function(who) {
	this.assert_char(who);
	
	return "在下";
}

rankd.prototype.query_self_rude = function(who) {
	this.assert_char(who);
	
	return "鄙人";
}

rankd.prototype.query_respect = function(who) {
	this.assert_char(who);
	
	return "您";
}

rankd.prototype.query_rude = function(who) {
	this.assert_char(who);
	
	return "小子";
}

rankd.prototype.query_close_self = function(who, other) {
	this.assert_char(who);
	this.assert_char(other);
	
	return "区区不才在下我";
}

rankd.prototype.gender_pronoun = function(who) {
	if (!who)
		return "它";
	
	switch (who.gender) {
	case "男性":
		return "他";
	case "女性":
		return "她";
	default:
		return "它";
	}
}

