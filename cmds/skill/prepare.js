//此文件暂时不会被加载
//暂时不使用这么复杂的技能系统，所有未装备武器的均统一到unarmed
module.exports = cmd_prepare;

var valid_types = {
		"claw":		"爪法",
		"cuff":		"拳法",
		"finger":	"指法",
		"hand":		"手法",
		"leg":		"腿法",
		"strike":	"掌法"
};

var f = global.FUNCTIONS;

function cmd_prepare() {
	if (!(this instanceof cmd_prepare))
		return new cmd_prepare();
};

cmd_prepare.prototype.execute = function(sender, args) {
	if (args && this.is_player() && this.is_busy())
		return f.notify_fail(sender, "你正忙着呢，不能准备特殊技能.");
	
}

