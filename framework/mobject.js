var MObject = function() {
	if (!(this instanceof MObject))
		return new MObject();
	
	this.holder = null;
	this.contains = new Array();
	
	this.is_character = function() {
		return false;
	}
}

module.exports = MObject;