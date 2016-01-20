var hb = function() {
	if (!(this instanceof hb))
		return new hb();
};

hb.call_heart_beat = function() {
	console.log("in heart beat");
};

hb.prototype.init = function() {
}	

hb.prototype.start = function() {
	setInterval(hb.call_heart_beat, __config.hb_interval);
}

module.exports = hb;
