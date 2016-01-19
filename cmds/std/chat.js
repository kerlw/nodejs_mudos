var cmd_chat = function() {
	if (!(this instanceof cmd_chat))
		return new cmd_chat();
	
	this.name = "chat";
	this.execute = function(sender, args) {
		console.log("cmd chat");
	};
};

module.exports = cmd_chat;
