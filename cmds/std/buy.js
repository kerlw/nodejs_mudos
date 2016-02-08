module.exports = cmd_buy;

var fm = require('framework');

function cmd_buy() {
	if (!(this instanceof cmd_buy))
		return new cmd_buy();
}

cmd_buy.prototype.execute = function(sender, arg) {
	if (!sender || !arg)
		return;
	
	var vender = FUNCTIONS.present(arg.vender, FUNCTIONS.environment(sender));
	if (!vender || !(vender instanceof fm.CHAR))
		return;

	if (!vender.has_good(arg.item))
		return FUNCTIONS.notify_fail(sender, _daemons.rankd.gender_pronoun(vender) + "并没有这件物品。");

	var good = _daemons.itemd.create_good(arg.item);
	if (!good)
		return FUNCTIONS.notify_fail(sender, "创建物品失败，请报告巫师！");

	if (sender.money < good.value) 
		return FUNCTIONS.notify_fail(sender, "你带的钱不够。");

	sender.add('money', -good.value);
	good.move_to(sender);
	FUNCTIONS.message("vision", "你购得了" + good.name + "。");
}