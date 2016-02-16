module.exports = cmd_fight;

var fm = require('framework');

function cmd_fight() {
	if (!(this instanceof cmd_fight))
		return new cmd_fight();
	
	this.execute = function(sender, arg) {
		if (!sender || !arg || !arg.target || !arg.about)
			return;
		
		var env = FUNCTIONS.environment(sender);
		var target = FUNCTIONS.present(arg.target, env);
		if (!target || !(target instanceof fm.NPC))
			return FUNCTIONS.notify_fail(sender, "询问的对象不在此处");
		
		target.do_inquiry(sender, arg.about);
	}
}