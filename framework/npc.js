var fs = require('fs');
var path = require ('path');

var NPC = function() {
	
}

NPC.__PATH = 'npc';

NPC.loadFromJSON = function(data) {
	for (var key in data) {
		console.log('key is ' + key + ', value is' + data[key]);
	}
}

NPC.load = function(filename) {
	var data = require(path.join(__dirname, '..', NPC.__PATH, filename + '.json'));
	return NPC.loadFromJSON(data);
}

exports.create = NPC;
exports.load = NPC.load;
exports.loadFromJSON = NPC.loadFromJSON;