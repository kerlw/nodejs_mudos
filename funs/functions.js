var fm = require("framework");

exports.error = function(msg) {
	if (msg)
        logger.error(msg);
	process.exit();
}

exports.origin_id = function(id) {
	id = id || "";
	var id = id.substring(0, id.indexOf('#'));
	return id;
}

exports.environment = function(obj) {
	if (obj && obj instanceof fm.MObject) {
		return obj.holder;
	}
	return null;
}

exports.remove_sent = function(obj, dest) {
	if (!obj || !dest || !dest.contains || !dest.contains[obj.id]) {
		return 0;
	}
	
	delete dest.contains[obj.id];
	dest.on_move_out(obj);
	return 1;
}

exports.move_object = function(obj, dest) {
	if (!obj || !dest)
		return 0;
	
	for (var ob = dest; ob; ob = ob.holder) {
		if (ob == obj)
			this.error("Can't move object inside itself.\n");
	}
	
	if (obj.holder && !this.remove_sent(obj, obj.holder)) {
		this.error("remove_sent failed");
	}
	
	obj.holder = dest;
	dest.contains[obj.id] = obj;
	
	dest.on_move_in(obj);
	
	if (obj.living())
		dest.setup_commands(obj);
	
	for (var id in dest.contains) {
		if (obj.living())
			dest.contains[id].setup_commands(obj);
		if (dest.contains[id].living())
			obj.setup_commands(dest.contains[id]);
	}
	
	if (dest.living())
		obj.setup_commands(dest);
	return 1;
}

exports.present = function(obj, env) {
	if (!obj || !env || !env.contains)
		return null;
	
	if (typeof obj === 'string') {
		for (var id in env.contains)
			if (obj === id)
				return env.contains[id];
	} else if (obj instanceof fm.MObject) {
		if (obj.holder === env)
			return obj;
	}
	return null;
}

exports.users = function() {
	return global._objs.players;
}

exports.random = function(max) {
	if (!max || max <= 0)
		return 0;
	
	return Math.floor(Math.random() * max * 100) % max;
}

exports.destruct = function(obj) {
	if (!obj || !(obj instanceof fm.MObject) || !obj.id)
		return;
	
	if (obj.holder) {
		this.remove_sent(obj, obj.holder);
		obj.holder = null;
	}

	if (HB_ENGINE.remove_object(obj));
	
	delete _objs.players[obj.id];
	delete _objs.rooms[obj.id];
	delete _objs.npcs[obj.id];
	delete _objs.items[obj.id];
	
} 

exports.chinese_number = function(number) {
	//TODO
	return number;
}

exports.all_inventory = function(ob) {
	ret = {};
	if (!ob || !(ob instanceof fm.MObject))
		return ret;
	
	return ob.contains;
}
