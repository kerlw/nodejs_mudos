module.exports = cmd_buy;

function cmd_buy() {
	if (!(this instanceof cmd_buy))
		return new cmd_buy();
}

cmd_buy.prototype.execute = function(sender, arg) {
	//TODO implement buy 
	console.log("buy command has not implemented yes!");
	
}