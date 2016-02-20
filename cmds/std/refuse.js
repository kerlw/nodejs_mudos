var fm = require('framework');

var cmd_refuse = function() {
	if (!(this instanceof cmd_refuse))
		return new cmd_refuse();
}

cmd_refuse.prototype.execute = function(sender, arg) {
	switch (arg.type) {
	case 'fight':
		var target = _objs.players[arg.target];
		if (target)
			FUNCTIONS.tell_object(target, "$(YEL)" + sender.name + "并不想和你较量。$NOR");
		break;
	case 'kill':
		//do nothing
		break;
	}
}

module.exports = cmd_refuse;