var MObject = function() {
	if (!(this instanceof MObject))
		return new MObject();
	
	this.id = "";
	this.holder = null;
	this.contains = {};
	this.flags = 0;
	this.cnd_flags = 0;
	
	//used to hold some temporary flags.
	this.tmps = {};
	
	this.init = function() {}
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

module.exports = MObject;