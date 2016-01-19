var fm = require("../framework");

exports.error = function(msg) {
	if (msg)
		console.log(msg);
	exit(-1);
}

exports.tell_object = function(obj, msg, type) {
	console.log("tell_object called " + msg);
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
		
		tell_object(obj, msg, type);
	}
}

exports.notify_fail = function(obj, msg) {
	tell_object(obj, msg, 'fail');
}

exports.environment = function(obj) {
	if (obj && obj instanceof fm.MObject) {
		return obj.holder;
	}
	return null;
}

exports.remove_sent = function(obj, dest) {
	if (!obj || !dest || !(obj in dest.contains))
		return;
	
	var index = dest.contains.indexOf(obj);
	if (index < (dest.contains.length - 1))
		dest.contains = dest.contains.slice(0, index).concat(dest.contains.slice(index + 1));
	else
		dest.contains = dest.contains.slice(0, index);
}

exports.move_object = function(obj, dest) {
	var ob;
	for (ob = dest; ob; ob = ob.holder) {
		if (ob == obj)
			this.error("Can't move object inside itself.\n");
	}
	
	if (obj.holder) {
		this.remove_sent(obj, obj.holder);
	}
	
	obj.holder = dest;
	dest.contains.push(obj);
	return 1;
}

