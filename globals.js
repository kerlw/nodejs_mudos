(function(r) {
	global._cmds = {};
	global.FUNCTIONS = {};
	global._objs = { 'players' : {}, 'rooms': {}, 'item' : {} };
	
	r('funs');
	r('cmds');
})(require);