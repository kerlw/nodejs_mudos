var fs = require('fs'),
	path = require('path');

exports.find_file = function(dir, name) {
	var pathname = path.join(dir, name);
	if (path.parse(pathname).ext !== '') {
		if (fs.statSync(pathname).isFile())
			return pathname;
	}
	
	if (fs.statSync(pathname + '.js').isFile())
		return pathname + '.js';
	if (fs.statSync(pathname + '.json'))
		return pathname + '.json';
	
	throw pathname + ' file not found!';
}

exports.MObject = require('./mobject.js');
exports.NPC = require('./npc.js');
exports.ROOM = require('./room.js');
exports.Player = require('./player.js');
exports.CMD = require('./cmd.js');
exports.extend = require('./oo.js');