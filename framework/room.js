var extend = require('./oo.js');
var MObject = require('./mobject.js');
var fs = require('fs');
var path = require ('path');

var ROOM = function() {};
extend(ROOM, MObject);

ROOM.loadFromJSON = function(data) {
	var ret = new ROOM();
	ret.name = data.name;
	ret.desc = data.desc;
	ret.exists = data.exists;
	ret.contains = new Array();
	return ret;
}

ROOM.load = function(filename) {
	var data = require(filename);
	return ROOM.loadFromJSON(data);
}

ROOM.prototype.look_response = function(avoid) {
	var ret = {
			'name' : this.name,
			'desc' : this.desc,
			'exists' : {},
			'objects' : {}
	}
	for (var dir in this.exists) {
		ret['exists'][dir] = _objs.rooms[this.exists[dir]];  
	}
	
	if (avoid instanceof Array) {
		for (var obj in this.contains) {
			if (obj in avoid)
				continue;
			
			ret['objects'][obj.name] = obj.id;
		}
	}
	return ret;
}

module.exports = ROOM;
