var fm = require('framework');

var chard = function() {
	if (!(this instanceof chard))
		return new chard();
	
	this.handle = {
			'unconcious' : {},
			'die' : {}
	};
}

chard.prototype.register_handle = function(query_key, type, fun) {
	if (!query_key || !type || !fun || typeof(fun) !== 'function')
		return;
	
	this.handle[type][query_key] = fun;
}

chard.prototype.handle_die = function(who) {
	if (!who || !who.is_player())
		return;
	
	for (var k in this.handle.die) {
		if (who.query_flag(k))
			return this.handle.die[k](who);
	}
	
	return 0;
}

chard.prototype.handle_unconcious = function(who) {
	if (!who || !who.is_player())
		return 0;
	
	for (var k in this.handle.die) {
		if (who.query_flag(k))
			return this.handle.die[k](who);
	}
	
	return 0;
}

module.exports = chard;