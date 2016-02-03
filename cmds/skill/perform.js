module.exports = cmd_perform;

function cmd_perform() {
	if (!(this instanceof cmd_perform))
		return new cmd_perform();
	
	this.execute = function(sender, args) {
		
	};
};

