module.exports = cmd_say;

function cmd_say() {
	if (!(this instanceof cmd_say))
		return new cmd_say();
}

cmd_say.prototype.execute = function(sender, arg) {
	if (!arg) {
		FUNCTIONS.message_vision("$N自言自语的不知所云.", sender);
		return 1;
	}
	
	FUNCTIONS.message_vision("$N说道:「" + arg + "」", sender);
}