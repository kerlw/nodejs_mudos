var extend = require('./oo.js');
var MObject = require('./mobject.js');
var fs = require('fs');
var path = require ('path');

var ROOM = function() {};
extend(ROOM, MObject);

ROOM.__PATH = '/data/room';

ROOM.loadFromJSON = function(data) {
	for (var key in data) {
		console.log('key is ' + key + ', value is' + data[key]);
	}
}

ROOM.load = function(filename) {
	var data = require(path.join(__dirname, '..', ROOM.__PATH, filename + '.json'));
	return NPC.loadFromJSON(data);
}

module.exports = ROOM;
