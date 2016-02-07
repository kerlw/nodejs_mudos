var fm = require('framework');

var shanzhapian = fm.extend(function() {
	"use strict"
	
	this.name = "山楂片";
	this.desc = "珂大侠最爱吃的零食";
	this.value = 80000;
}, _std.pill);

shanzhapian.prototype.use = function(who) {
	if (!who || !(who instanceof fm.Char))
		return;
	
	who.food += 30;
	if (who.food > who.max_food)
		who.food = who.max_food;
	
	who.vitality += 50;
	if (who.vitality > who.eff_vitality)
		who.vitality = who.eff_vitality;
}

module.exports = shanzhapian;