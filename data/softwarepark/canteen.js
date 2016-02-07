var fm = require('framework');

var canteen = fm.extend(function() {
	this.name = "小卖部";
	this.desc = "食堂里的小卖部";

	this.exits = {
		"up" : "softwarepark/office"
	};
	this.objs = {
		"softwarepark/npc/shouhuoyuan" : 1
	};
	this.setup();
}, fm.ROOM);

module.exports = canteen;