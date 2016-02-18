var fm = require('framework');

var combined = fm.extend(function() {
	if (!(this instanceof combined))
		return new combined();
	
	this.amount = 1;
	this.base_weight = 0;
	this.base_unit = "";
	
}, fm.ITEM);

combined.prototype.query_amount = function() {
	return this.amount;
}

combined.prototype.set_amount = function(value) {
	if (value <= 0)
		return FUNCTIONS.destruct(this);
	
	this.amount = value;
	this.set_weight(value * this.base_weight);
	
	//TODO notify client refresh view 
}

combined.prototype.add_amount = function(value) {
	return this.set_amount(this.amount + value);
}

combined.prototype.short_desc = function() {
	return FUNCTIONS.chinese_number(this.query_amount()) + this.query('base_unit') 
			+ this.base.short_desc.call(this);
}

combined.prototype.move_to = function(dest, silent) {
	if (this.base.move_to.call(this, dest, silent)) {
		var inv = FUNCTIONS.all_inventory(dest);
		var total = this.query_amount();
		if (this.query('broken'))
			return 1;

		// combine same items
		for (var key in inv) {
			if (inv[key] === this)
				continue;
			if (inv[key].query('broken'))
				continue;
			if (FUNCTIONS.origin_id(inv[key]) === FUNCTIONS.origin_id(this)) {
				total += inv[key].query_amount();
				FUNCTIONS.desctruct(inv[key]);
			}
		}
		this.set_amount(total);
		return 1;
	}
	return 0;
}

module.exports = combined;