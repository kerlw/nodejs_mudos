var fm = require('framework');

var pill = fm.extend(function() {
	"use strict"
}, fm.ITEM);

pill.prototype.can_use = function(who) {
	return 1;
}

pill.prototype.use = function(who) {
}

module.exports = pill;