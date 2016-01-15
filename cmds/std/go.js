module.exports = cmd_go;

function cmd_go() {
	if (!(this instanceof cmd_go))
	    return new cmd_go();
	
	this.name = 'go';
	this.execute = function(sender, target) {
		console.log("cmd go!");
	};
}
