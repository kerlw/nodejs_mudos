module.exports = cmd_kill;

var fm = require('framework');

function cmd_kill() {
	if (!(this instanceof cmd_kill))
		return new cmd_kill();
	
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
			return FUNCTIONS.notify_fail(sender, "自杀可不是闹着玩的!");
		
		if (!target.is_character() || target.is_corpse()) 
			return FUNCTIONS.notify_fail(sender, "看清楚点，那并不是活物。");
		
		if (target.is_player() && target.is_newbie()) 
			return FUNCTIONS.notify_fail(sender, "请爱护新手玩家，让世界更和谐。");
		
		if (target.is_fighting(sender) && target.is_killing(sender.id))
			return FUNCTIONS.notify_fail(sender, "$(YEL)加～油～～！加～油～～！$NOR");
		
		if (target.query_flag('can_speak'))
			FUNCTIONS.message_vision("$N对着$n喝到：「" + _daemons.rankd.query_rude(target) +
					"！今日不是你死就是我活！」", sender, target);

		sender.kill(target);
		
		if (!target.is_player()) {
			target.kill(sender);
		} else {
			target.fight(sender);
			if (!target.is_killing(sender.id)) {
				FUNCTIONS.message("confirm", 
					{
						confirm_id : "kill_" + sender.id,
						msg : "$(HIR)看起来" + sender.name + "想要杀死你，你是否要与之性命相搏？$NOR", 
						accept : { cmd : "kill", cmd_arg : sender.id }
						// make refuse do nothing.
//						,refuse : { cmd : "refuse", cmd_arg : { type : "kill", target : sender.id }}
					},
					target);
			}
		}
	}
}