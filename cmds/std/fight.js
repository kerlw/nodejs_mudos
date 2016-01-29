module.exports = cmd_fight;

var fm = require('framework');

function cmd_fight() {
	if (!(this instanceof cmd_fight))
		return new cmd_fight();
	
	this.execute = function(sender, arg) {
		if (!sender)
			return;
		
		var env = FUNCTIONS.environment(sender);
		if (!env || env['no_fight'])
			return FUNCTIONS.notify_fail(sender, "这里禁止战斗!");
		
		var target = FUNCTIONS.present(arg, env);
		if (!target || !(target instanceof fm.MObject))
			return FUNCTIONS.notify_fail(sender, "你想攻击谁？");
		
		if (target === sender)
			return FUNCTIONS.notify_fail(sender, "你并不会双手互搏呀!");
		
		if (!target.is_character()) 
			return FUNCTIONS.notify_fail(sender, "丧心病狂了吗，连非生物都攻击？");
		
		if (target.is_fighting(sender))
			return FUNCTIONS.notify_fail(sender, "加～油～～！加～油～～！");
		
		if (!target.living())
			return FUNCTIONS.notify_fail(sender, target.name + "已经无法战斗了");
		
		if (target.is_player() && target['fight_pending'] != sender) {
			//TODO tell_object
			return 1;
		}
		
		if (!target.is_player() && !target.accept_fight(sender)) {
			FUNCTIONS.notify_fail(sender, "看起来" + target.name + "并不想和你较量.");
			return 0;
		}
		
		sender.fight(target);
		target.fight(sender);
	}
	
}