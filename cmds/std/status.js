var fm = require('framework');

var cmd_status = function() {
	if (!(this instanceof cmd_status))
		return new cmd_status();
}

cmd_status.prototype.execute = function(sender, arg) {
	//TODO use arg to fetch other's status (for wizard)
	FUNCTIONS.message('status', sender.desc_status(), sender);
}

module.exports = cmd_status;