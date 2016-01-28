module.exports = cmd_go;

var fm = require('framework');

function cmd_go() {
	if (!(this instanceof cmd_go))
	    return new cmd_go();
	
	this.name = 'go';
	this.execute = function(sender, arg) {
		if (!(sender instanceof fm.Player))
			return 1;
		
		if (!arg) {
			return FUNCTIONS.notify_fail(sender, "你要往哪个方向走？");
		}
		
		if (arg === 'away') {
			if (!sender.is_fighting()) {
				return FUNCTIONS.notify_fail(sender, "你又不在战斗中，还跑个什么劲！");
			}
			return this.do_flee(sender);
		}
		
		var env = FUNCTIONS.environment(sender);
		if (!env) {
			return FUNCTIONS.notify_fail(sender, "你哪也去不了!");
		}
		
		if (!env.exits || !env.exits[arg]) {
			return FUNCTIONS.notify_fail(sender, "这个方向没有出路。");
		}
		
		var dest_room = _objs.rooms[env.exits[arg]];
		if (!dest_room) {
			return FUNCTIONS.notify_fail(sender, "这个方向无法移动，请报告巫师。");
		}
		
		if (sender.move_to(dest_room)) {
			FUNCTIONS.tell_room(env, sender.name + "离开了.", env);
			FUNCTIONS.tell_room(dest_room, sender.name + "走了过来.", new Array(sender))
		}
		
		fm.CMD.exec(sender, 'look');
	};
	
	this.do_flee = function(sender) {
		return 1;
	}
	

}
