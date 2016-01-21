var extend = require('./oo.js');
var Char = require('./character.js');
var fs = require('fs');
var path = require ('path');

var NPC = extend(function() {}, Char);

NPC.__PATH = '/data/npc'; 

NPC.loadFromJSON = function(data) {
	for (var key in data) {
		console.log('key is ' + key + ', value is' + data[key]);
	}
}

NPC.load = function(filename) {
	var data = require(path.join(__dirname, '..', NPC.__PATH, filename + '.json'));
	return NPC.loadFromJSON(data);
}

module.exports = NPC;