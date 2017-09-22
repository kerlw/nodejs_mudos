var command = function() {};

command.exec = function(who, cmd, arg) {
	if (!cmd)
		return;
	
	if (!_cmds[cmd]) {
        logger.error("Unknown command received : " + cmd);
		return;
	}

	logger.debug("[CMD] " + who.name + "(" + who.id + ") is executing cmd " + cmd + " with arg:" + arg );
	return _cmds[cmd].execute(who, arg);
}

module.exports = command;
