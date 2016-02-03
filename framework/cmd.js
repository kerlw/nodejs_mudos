var command = function() {};

command.exec = function(who, cmd, arg) {
	if (!cmd)
		return;
	
	if (!_cmds[cmd]) {
		console.log("[ERROR] Unknown command received : " + cmd);
		return;
	}
	
	return _cmds[cmd].execute(who, arg);
}

module.exports = command;
