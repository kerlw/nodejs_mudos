var fm = require('framework');

var shouhuoyuan = fm.extend(function() {
	if (!(this instanceof shouhuoyuan))
		return new shouhuoyuan();
	
	this.name = "售货员";
	this.desc = "";

	this.add_good("softwarepark/obj/shanzhapian");

	this.setup();
}, _std.vender);

module.exports = shouhuoyuan;