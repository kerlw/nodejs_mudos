var fm = require('framework');

var money = fm.extend(function() {
	if (!(this instanceof money))
		return new money();
	
	this.base_value = 1;
	
}, require('./combined.js'));

money.prototype.value = function() {
	return this.query_amount() * this.query('base_value');
}

module.exports = money;