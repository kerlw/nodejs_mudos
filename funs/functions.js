var fm = require("../framework");

exports.error = function(msg) {
	if (msg)
		console.log(msg);
	process.exit();
}

exports.tell_object = function(obj, msg, type) {
	if (!obj || !msg)
		return;
	
	//TODO add more conditions, ex: socket is valid
	if (obj instanceof fm.Player) {
		if (!type)
			obj.socket.emit("resp", msg);
		else
			obj.socket.emit(type, msg);
	}
}

exports.tell_room = function(room, msg, type, avoid) {
	if (!room || !room.contains.length || !msg)
		return;
	
	for (var obj in room.contains) {
		if (obj in avoid)
			continue;
		
		this.tell_object(obj, msg, type);
	}
}

exports.notify_fail = function(obj, msg) {
	this.tell_object(obj, msg, 'fail');
	return 1;
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

exports.present = function(objId, env) {
	if (!objId || typeof objId != 'string' || !env || !(env instanceof fm.MObject))
		return null;
	
	return env.contains[objId];
}
