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
	
	//used to create contained item's id
	this.start_suffix = 0;
	
	//used to hold some temporary flags.
	this.tmps = {};
	
	this.call_outs = {};
	
	this.init = function() {}
}

MObject.prototype.add_action = function(key, name, callback) {
	this.actions = this.actions || {};
	this.actions[key] = {
			name : name,
			cb : callback
	}
}

MObject.prototype.valid_action = function(who, action) {
	if (!who || !action || !this.actions || !this.actions[action])
		return 0;
	return 1;
}

MObject.prototype.list_actions = function(who) {
	if (!this.actions)
		return null;
	
	ret = {};
	for (var action in this.actions) {
		if (this.valid_action(who, action))
			ret[action] = this.actions[action].name;
	}
	return ret;
}

MObject.prototype.do_action = function(key, who) {
	if (!this.actions || this.actions[key]) {
		FUNCTIONS.notify_fail(who, "你想干什么?");
		return;
	}
	
	if (typeof(this.actiions[key].cb) === 'function') {
		this.actions[key].cb(who);
	}
}

MObject.prototype.set = function(key, value) {
	this[key] = value;
}

MObject.prototype.query = function(key) {
	return this[key];
}

MObject.prototype.del = function(key) {
	delete this[key];
}

MObject.prototype.short_desc = function() {
	return this.name;
}

MObject.prototype.set_flag = function(flag, value) {
	this.kv_flags[flag] = value;
}

MObject.prototype.query_flag = function(flag) {
	return this.kv_flags[flag];
}

MObject.prototype.del_flag = function(flag) {
	delete this.kv_flags[flag];
}

MObject.prototype.add_flag = function(flag, inc) {
	if (!this.kv_flags[flag]) {
		this.kv_flags[flag] = inc;
		return inc;
	}
	
	this.kv_flags[flag] += inc;
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

MObject.prototype.setup_commands = function(obj) {
}

MObject.prototype.on_move_in = function(obj) {
	for (var k in this.contains) {
		var ob = this.contains[k];
		if (ob && ob instanceof MObject && ob.is_character() && ob.is_player())
			ob.command('look');
	}
}

MObject.prototype.on_move_out = function(obj) {
	for (var k in this.contains) {
		var ob = this.contains[k];
		if (ob && ob instanceof MObject && ob.is_character() && ob.is_player())
			ob.command('look');
	}
}

MObject.prototype.lazy_init = function() {
}

MObject.prototype.set_resetable = function(param) {
	this.call_out('reset', param.timeout, param);
}

MObject.prototype.reset = function(timeout, repeat) {
	throw this.id + " set to resetable without reset implemented";
}

module.exports = MObject;