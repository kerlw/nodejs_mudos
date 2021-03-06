var timer = require("timers");

module.exports = hb;

function hb() {
	if (!(this instanceof hb))
		return new hb();
	
	this.num_hb_calls = 0;
	this.last_hb_at = 0;
	this.last_hb_elapse = 0;
	this.hb_array = new Array();
	this.hb_append_array = new Array();
	this.current_hb = null;
	this.current_hb_obj = null;
};

function call_heart_beat() {
	var cur_hb = null;
	while (HB_ENGINE.hb_append_array.length > 0) {
		cur_hb = HB_ENGINE.hb_append_array.shift();
		if (!cur_hb.deleted)
			HB_ENGINE.hb_array.push(cur_hb);
	}
	
	var now = new Date().valueOf();
	HB_ENGINE.last_hb_at = now;
    logger.debug("[HB_ENGINE] heart_beat begin at " + now + ", " + HB_ENGINE.hb_array.length + " objects in queue");
	while (HB_ENGINE.hb_array.length > 0) {
		cur_hb = HB_ENGINE.hb_array.shift();
		if (cur_hb.deleted)
			continue;
		
		if (!cur_hb.obj || !(cur_hb.obj.flags & FLAGS.O_HEART_BEAT))
			continue;
		
		HB_ENGINE.hb_append_array.push(cur_hb);
		var ob = cur_hb.obj;
		if (--cur_hb.hb_ticks > 0)
			continue;
		
		cur_hb.hb_ticks = cur_hb.time_to_hb;
		if (!ob.heart_beat || !(ob.heart_beat instanceof Function))	//if heart_beat is not a function in ob, continue
			continue;
		
		HB_ENGINE.current_hb = cur_hb;
		HB_ENGINE.current_hb_obj = ob;
		ob.heart_beat();
		HB_ENGINE.current_hb = null;
		HB_ENGINE.current_hb_obj = null;

	}

	HB_ENGINE.last_hb_elapse = (new Date().valueOf() - now);
	logger.debug("[HB_ENGINE] heart_beat done. used " + HB_ENGINE.last_hb_elapse + "ms");

	
	if (HB_ENGINE.hb_append_array.length > 0) {
		//swap hb_array and hb_append_array
		var tmp = HB_ENGINE.hb_array;
		HB_ENGINE.hb_array = HB_ENGINE.hb_append_array;
		HB_ENGINE.hb_append_array = tmp;
	}
};

hb.prototype.init = function() {
}

hb.prototype.start = function() {
	timer.setInterval(call_heart_beat, __config.hb_interval);
}

hb.prototype.query_heart_beat = function(obj) {
	if (!obj)
		return 0;
	
	if (obj == this.current_hb_obj)
		return this.current_hb.time_to_hb;
	
	for (var hb in this.hb_append_array) {
		if (hb.obj == obj)
			return hb.time_to_hb;
	}
	
	for (var hb in this.hb_array) {
		if (hb.obj == obj)
			return hb.time_to_hb;
	}
}

hb.prototype.find_target_hb = function(obj) {
	if (!obj)
		return null;
	
	var target_hb = null;
	if (obj === this.current_hb_obj) {
		target_hb = this.current_hb;
	}
	
	if (!target_hb) {
		for (var i = 0; i < this.hb_append_array.length; i++) {
			var hb = this.hb_append_array[i];
			if (hb && hb.obj === obj) {
				target_hb = hb;
				break;
			}
		}
	}
	
	if (!target_hb) {
		for (var i = 0; i < this.hb_array.length; i++) {
			var hb = this.hb_array[i];
			if (hb && hb.obj === obj) {
				target_hb = hb;
				break;
			}
		}
	}
	
	return target_hb;
} 

hb.prototype.set_heart_beat = function(obj, to) {
	if (to < 0 || !obj)
		return;

	logger.debug("[HB_ENGINE] " + obj.id + " is setting heart beat to " + to);
	var target_hb = this.find_target_hb(obj);
	
	if (to === 0) {
		obj.flags &= ~FLAGS.O_HEART_BEAT;
		if (target_hb) {
			target_hb.deleted = 1;
			return 1;
		}
	} else {
		obj.flags |= FLAGS.O_HEART_BEAT;
		if (!target_hb) {
			target_hb = {
					deleted : 0,
					obj : obj,
					time_to_hb : to,
					hb_ticks : to
			};
			this.hb_append_array.push(target_hb);
			return 1;
		} else {
			target_hb.deleted = 0;
			target_hb.time_to_hb = to;
			target_hb.hb_ticks = to;
			return 1;
		}
	}
	return 0;
}

hb.prototype.remove_object = function(obj) {
	var target_hb = this.find_target_hb(obj);
	if (target_hb)
		target_hb.deleted = 1;
}

hb.prototype.desc = function() {
	return {
		'nums' : this.hb_array.length + this.hb_append_array.length,
		'last_hb_at' : this.last_hb_at,
		'last_hb_elapse' : this.last_hb_elapse
	};
}