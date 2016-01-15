var cmd_say = function() {
	if (!(this instanceof cmd_say))
		return new cmd_say();
	
	this.name = "say";
	this.execute = function(sender, target) {
		console.log("cmd say");
	};
};

module.exports = cmd_say;
