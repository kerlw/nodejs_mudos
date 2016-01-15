var command = function() {};

command.exec = function(who, arg) {
	if (!arg)
		return;
	
	var args = arg.split(" ", 2);
	
	if (args[0] in _cmds) {
		if (args.length == 2)
			return _cmds[args[0]].execute(who, args[1]);
		else
			return _cmds[args[0]].execute(who);
	}
}

module.exports = command;
