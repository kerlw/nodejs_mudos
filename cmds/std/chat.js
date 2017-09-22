module.exports = cmd_chat;

function cmd_chat() {
	if (!(this instanceof cmd_chat))
		return new cmd_chat();
	
	this.name = "chat";
	this.execute = function(sender, args) {
        logger.debug("cmd chat");
	};
};

