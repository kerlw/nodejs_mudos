var command = function() {};

command.exec = function(who, cmd, arg) {
	if (!cmd)
		return;
	
	if (!_cmds[cmd]) {
		console.log("[ERROR] Unknown command received : " + cmd);
		return;
	}

	global.logger.debug("[CMD] " + who.name + "(" + who.id + ") is executing cmd " + cmd + " with arg:" + arg );
	return _cmds[cmd].execute(who, arg);
}

module.exports = command;
