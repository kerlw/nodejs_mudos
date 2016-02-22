var extend = require('./oo.js'),
	fm = require('framework');
	MObject = require('./mobject.js'),
	fs = require('fs'),
	path = require('path');

var ROOM = extend(function(){}, MObject);


ROOM.MAX_OBJECT_COUNT = 100;
ROOM.MAX_RESET_ROUND = 10;

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
	ret.start_suffix = 0;
	if (data.reset) {
		ret.reset_round = 0;
		ret.set_resetable(data.reset);
	}
	
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
		this.append_obj(name, this.objs[name]);
	}
}

ROOM.prototype.append_obj = function(path, count) {
	if (!path || count <= 0)
		return;
	
	if (count > ROOM.MAX_OBJECT_COUNT)
		count = ROOM.MAX_OBJECT_COUNT;
	
	var i = 0,
		suffix = this.start_suffix;
		pathname = fm.find_file(DATA_PATH, path);
	fs.accessSync(pathname, fs.F_OK | fs.R_OK);
		
	var ctor = require(pathname);
	if (typeof ctor !== 'function')
		return;
	
	while (i < count) {
		var id = path + '#' + suffix;
		suffix++;
		if (this.contains[id]) {
			continue;
		}
		
		var obj = new ctor();
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

ROOM.prototype.reset = function(param) {
	this.reset_round = (this.reset_round + 1) % ROOM.MAX_RESET_ROUND;
	this.start_suffix = this.reset_round * ROOM.MAX_OBJECT_COUNT;
	
	for (var k in this.objs) {
		var total = this.objs[k],
			count = 0;
		
		for (var id in this.contains) {
			if (FUNCTIONS.origin_id(id) == k)
				count++;
		}
		this.append_obj(k, total - count);
	}
	
	
	if (param.repeat)
		this.call_out('reset', param.timeout, param);
}

module.exports = ROOM;
