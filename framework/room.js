var extend = require('./oo.js'),
	fm = require('framework');
	MObject = require('./mobject.js'),
	fs = require('fs'),
	path = require('path');

var ROOM = extend(function(){}, MObject);

ROOM.__DIRECTIONS__ = {
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
	"out" : "外"
}

ROOM.__DIR_OPPOSITE_NAME__ = {
	"east" : "西面",
	"west" : "东面",
	"north" : "南面",
	"south" : "北面",
	
	"northeast" : "西南边",
	"southeast" : "西北边",
	"northwest" : "东南边",
	"southwest" : "东北边",
	
	"up" : "下边",
	"down" : "上面",
	
	"enter" : "外面",
	"out" : "内面"
}

ROOM.loadFromJSON = function(data) {
	var ret = new ROOM();
	ret.name = data.name || "unnamed";
	ret.desc = data.desc || "";
	ret.exits = data.exits || {};
	ret.objs = data.objs || {};
	var kvs = data.kvs || {};
	for (var k in kvs) {
		ret[k] = kvs[k];
	}
	ret.setup();
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
			'objs' : {}
	};
	
	for (var dir in this.exits) {
		if (!(dir in ROOM.__DIRECTIONS__))
			continue;
			
		var room_id = this.exits[dir];
		if (_objs.rooms[room_id]) {
			ret['exits'][dir] = {
					id : room_id,
					dir : dir,
					dir_name : ROOM.__DIRECTIONS__[dir],
					name : _objs.rooms[room_id].name
			};
		}
	}
	
	for (var objId in this.contains) {
		if (avoid && avoid[objId])
			continue;
		
		ret.objs[this.contains[objId].id] = this.contains[objId].display_name();
	}
	return ret;
}

ROOM.prototype.setup = function() {
	for (var name in this.objs) {
		var count = this.objs[name],
			i = 0,
			pathname = fm.find_file(DATA_PATH, name);
		fs.accessSync(pathname, fs.F_OK | fs.R_OK);
		while (i < count) {
			if (!pathname)
				break;

			var id = name + '#' + i,
				tmp = require(pathname);
			
			if (typeof tmp !== 'function')
				break;

			var obj = new tmp();
			if (obj && obj instanceof fm.MObject) {
				obj.id = id;
				if (obj instanceof fm.NPC)
					_objs.npcs[id] = obj;
				else
					_objs.items[id] = obj;
				if (obj.query_tmp('lazy_init'))
					obj.lazy_init();
				obj.move_to(this);
			}
			i++;
		}
	}
}

module.exports = ROOM;
