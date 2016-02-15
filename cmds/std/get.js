module.exports = cmd_get;

var fm = require('framework');

function cmd_get() {
	if (!(this instanceof cmd_get))
		return new cmd_get();
}

cmd_get.prototype.execute = function(sender, arg) {
	if (!sender || !arg || !arg.target)
		return;
	
	if (sender.is_busy())
		return FUNCTIONS.notify_fail(sender, "你正忙着呢。");
	
	var env = null;
	if (arg.from) {
		env = FUNCTIONS.present(arg.from, sender);
		if (!env)
			env = FUNCTIONS.present(arg.from, FUNCTIONS.environment(sender));
		if (!env)
			return FUNCTIONS.notify_fail(sender, "目标已丢失。");
	} else
		env = FUNCTIONS.environment(sender);
	
	if (env.living())
		return FUNCTIONS.notify_fail(sender, "你想抢劫吗？");
	
	if (arg.target === 'all') {
		return FUNCTIONS.notify_fail(sender, "目前只能一件件拾取。");
	} else {
		var obj = FUNCTIONS.environment(arg.target, env);
		if (!obj)
			return FUNCTIONS.notify_fail(sender, "目标已丢失。");
		
		this.do_get(sender, obj);
	}
}

cmd_get.prototype.do_get = function(sender, obj) {
	if (!sender || !obj) 
		return;
	
	if (obj.move_to(sender)) {
		FUNCTIONS.message_vision("$N拾取了$n", sender, obj);
		if (sender.is_fighting())
			sender.start_busy(2);
		return 1;
	}
	return 0;
}