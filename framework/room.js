var extend = require('./oo.js');
var MObject = require('./mobject.js');
var fs = require('fs');
var path = require ('path');

var ROOM = function() {};
extend(ROOM, MObject);

ROOM.__DIRECTORIES__ = {
	"east" : "东",
	"west" : "西",
	"north" : "北",
	"south" : "南",
	
	"northeast" : "东北",
	"southeast" : "东南",
	"northwest" : "西北",
	"southwest" : "西南",
	
	"up" : "上",
	"down" : "下",
	
	"enter" : "内",
	"out" : "外",
}

ROOM.loadFromJSON = function(data) {
	var ret = new ROOM();
	ret.name = data.name;
	ret.desc = data.desc;
	ret.exits = data.exits;
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
			'exits' : {},
			'objects' : {}
	};
	
	for (var dir in this.exits) {
		if (!(dir in ROOM.__DIRECTORIES__))
			continue;
			
		var room_id = this.exits[dir];
		if (_objs.rooms[room_id]) {
			ret['exits'][dir] = {
					id : room_id,
					dir : dir,
					dir_name : ROOM.__DIRECTORIES__[dir],
					name : _objs.rooms[room_id].name
			};
		}
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
