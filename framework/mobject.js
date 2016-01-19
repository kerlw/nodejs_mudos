var MObject = function() {
	if (!(this instanceof MObject))
		return new MObject();
	
	this.holder = null;
	this.contains = new Array();
	this.flags = 0;
	
	this.is_character = function() {
		return false;
	}
	
	this.look_response = function() {
		return null;
	}
	
	this.move_to = function(obj) {
		return FUNCTIONS.move_object(this, obj);
	}
	
	this.init = function() {}
}

module.exports = MObject;