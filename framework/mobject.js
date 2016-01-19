var MObject = function() {
	if (!(this instanceof MObject))
		return new MObject();
	
	this.holder = null;
	this.contains = new Array();
	this.flags = 0;
	
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

module.exports = MObject;