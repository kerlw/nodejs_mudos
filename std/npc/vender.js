var fm = require('framework')
	path = require('path');

var vender = fm.extend(function() {
	if (!(this instanceof vender))
		return new vender();

	this.look_type = "vender";
	this.goods = {};

	this.setup();
}, fm.NPC);

vender.prototype.add_good = function(path) {
	this.goods[path] = 0;
}

vender.prototype.has_good = function(path) {
	if (!this.goods[path])
		return 0;
	return 1;
}

//vender.prototype.sell_good = function(path, who) {
//	if (!who || !who.living())
//		return;
//}

vender.prototype.is_vender = function() {
	return 1;
}

vender.prototype.list_goods = function() {
	var ret = {};
	for (var key in this.goods)	{
		var good = this.goods[key];
		if (good && good.name && good.value) {
			ret[key] = good; // { name : good.name, value : good.value };
		}
	}
	return ret;
}

vender.prototype.setup = function() {
	for (var key in this.goods)	{
		if (this.goods[key] === 0) {
			var tmp = new (require(path.join(DATA_PATH, key + ".js")))();
			if (tmp && tmp instanceof fm.ITEM) {
				this.goods[key] = {
					name : tmp.name,
					value : tmp.value
				}
			}
		}
	}
}

module.exports = vender;