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
		
		if (target.is_player() && target['fight_pending'] !== sender.id) {
			if (sender.fight_pending && sender.fight_pending !== target.id 
					&& _objs.players[sender.fight_pending]) {
				FUNCTIONS.tell_object(_objs.players[sender.fight_pending], 
						"$(YEL)" + sender.name + "取消了和你比试的念头。$NOR");
				sender.fight_pending = target.id;
			}
			FUNCTIONS.message("confirm", 
					{
						msg : "$(YEL)" + sender.name + "想要和你切磋，是否同意？$NOR",
						cmd : "fight",
						cmd_arg : sender.id
					}
				, target);
			FUNCTIONS.tell_object(sender, "$(YEL) 对方是玩家控制的角色，要等对方确认方能进行切磋。 $NOR");
			return 1;
		}
		
		if (!target.is_player() && !target.accept_fight(sender)) {
			FUNCTIONS.notify_fail(sender, "看起来" + target.name + "并不想和你较量.");
			return 0;
		}
		
		delete target.fight_pending;
		sender.fight(target);
		target.fight(sender);
	}
}