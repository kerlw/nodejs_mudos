var MObject = function() {
	if (!(this instanceof MObject))
		return new MObject();
	
	this.id = "";
	this.name = "OBJECT";
	this.holder = null;
	this.contains = {};
	this.flags = 0;
	this.kv_flags = {};
	this.cnd_flags = 0;
	
	//used to hold some temporary flags.
	this.tmps = {};
	
	this.call_outs = {};
	
	this.init = function() {}
}

MObject.prototype.set_flag = function(flag, value) {
	this.kv_flags[flag] = value;
}

MObject.prototype.query_flag = function(flag) {
	return this.kv_flags[flag];
}

MObject.prototype.is_character = function() {
	return false;
}

MObject.prototype.look_response = function() {
	return null;
}

MObject.prototype.move_to = function(dest) {
	return FUNCTIONS.move_object(this, dest);
}

MObject.prototype.living = function() {
	return this.flags & FLAGS.O_ENABLE_COMMANDS;
}

MObject.prototype.enable_commands = function() {
	this.flags |= FLAGS.O_ENABLE_COMMANDS;
}

MObject.prototype.disable_commands = function() {
	this.flags &= ~FLAGS.O_ENABLE_COMMANDS;
}

MObject.prototype.set_heart_beat = function(to) {
	HB_ENGINE.set_heart_beat(this, to);
}

MObject.prototype.is_interactive = function() {
	return 0;
}

MObject.prototype.query_tmp = function(key) {
	return this.tmps[key];
}

MObject.prototype.set_tmp = function(key, value) {
	if (!key)
		return;
	
	this.tmps[key] = value;
}

MObject.prototype.del_tmp = function(key) {
	if (key)
		delete this.tmps[key];
}

MObject.prototype.call_out = function(func, delay, param) {
	console.log("call_out is invoked : " + func + " in " + delay + " seconds");
	if (delay <= 0)
		delay = 1;

	this.remove_call_out(func);
	if (this[func] && typeof this[func] === 'function') {
		this.call_outs[func] = setTimeout(call_out_fun, delay * 1000, this[func], this, param);
	}
}

var call_out_fun = function(func, obj, arg) {
	func.call(obj, arg);
}

MObject.prototype.remove_call_out = function(func) {
	if (this.call_outs[func]) {
		clearTimeout(this.call_outs[func]);
		delete this.call_outs[func];
	}
}

MObject.prototype.display_name = function() {
	return this.name;
}

module.exports = MObject;