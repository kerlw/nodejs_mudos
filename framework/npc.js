var extend = require('./oo.js');
var MObject = require('./mobject.js');
var fs = require('fs');
var path = require ('path');

var NPC = function() {}
extend(NPC, MObject);

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