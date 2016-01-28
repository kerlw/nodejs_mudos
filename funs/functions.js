var fm = require("../framework");

exports.error = function(msg) {
	if (msg)
		console.log(msg);
	process.exit();
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
	return 1;
}

exports.move_object = function(obj, dest) {
	if (!obj || !dest)
		return;
	
	for (var ob = dest; ob; ob = ob.holder) {
		if (ob == obj)
			this.error("Can't move object inside itself.\n");
	}
	
	if (obj.holder && !this.remove_sent(obj, obj.holder)) {
		this.error("remove_sent failed");
	}
	
	obj.holder = dest;
	dest.contains[obj.id] = obj;
	return 1;
}

exports.object_present = function(objId, env) {
	if (!objId || typeof objId != 'string' || !env || !(env instanceof fm.MObject))
		return null;
	
	return env.contains[objId];
}

exports.present = function(obj, env) {
	if (!obj || !env || !(obj instanceof MObject) || !(env instanceof MObject))
		return 0;
	
	if (obj.holder === env)
		return 1;
	return 0;
}

exports.users = function() {
	return global._objs.players;
}
