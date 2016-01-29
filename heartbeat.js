module.exports = hb;

function hb() {
	if (!(this instanceof hb))
		return new hb();
	
	this.num_hb_calls = 0;
	this.hb_array = new Array();
	this.hb_append_array = new Array();
	this.current_hb = null;
	this.current_hb_obj = null;
};

hb.call_heart_beat = function() {
	var cur_hb = null;
	while (HB_ENGINE.hb_append_array.length > 0) {
		cur_hb = HB_ENGINE.hb_append_array.shift();
		if (!cur_hb.deleted)
			HB_ENGINE.hb_array.push(cur_hb);
	}
	
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
	setInterval(hb.call_heart_beat, __config.hb_interval);
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

hb.prototype.set_heart_beat = function(obj, to) {
	if (to < 0 || !obj)
		return;
	
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
			target_hb.time_to_hb = to;
			target_hb.hb_ticks = to;
			return 1;
		}
	}
	return 0;
}
