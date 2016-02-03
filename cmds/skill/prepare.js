module.exports = cmd_prepare;

var valid_types = {
		"claw":		"爪法",
		"cuff":		"拳法",
		"finger":	"指法",
		"hand":		"手法",
		"leg":		"腿法",
		"strike":	"掌法"
};

function cmd_prepare() {
	if (!(this instanceof cmd_prepare))
		return new cmd_prepare();
};

cmd_prepare.prototype.execute = function(sender, args) {
	
}

