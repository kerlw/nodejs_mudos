exports.tell_object = new function(obj, type, msg) {
	if (!obj || !type || !msg)
		return;
	
	if (obj instanceof Player)
		obj.socket.emit(type, msg);
	
}