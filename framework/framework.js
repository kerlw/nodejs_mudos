var fs = require('fs'),
	path = require('path');

exports.find_file = function(dir, name) {
	var pathname = path.join(dir, name);
	if (path.parse(pathname).ext !== '') {
		if (fs.statSync(pathname).isFile())
			return pathname;
	}
	
	if (fs.existsSync(pathname + ".js") && fs.statSync(pathname + '.js').isFile())
		return pathname + '.js';
	if (fs.existsSync(pathname + ".json") && fs.statSync(pathname + '.json'))
		return pathname + '.json';
	
	//throw 'File "' + name + '" not found in directory ' + dir;
	return null;
}

exports.SKILL = require('./skill.js');
exports.MObject = require('./mobject.js');

exports.CHAR = require('./character.js');
exports.NPC = require('./npc.js');
exports.Player = require('./player.js');
exports.ANIMAL = require('./animal.js');

exports.ROOM = require('./room.js');

exports.CMD = require('./cmd.js');

exports.ITEM = require('./item.js');
exports.WEAPON = require('./weapon.js');

exports.extend = require('./oo.js');
