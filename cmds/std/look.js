module.exports = cmd_look;

var fm = require('../../framework');

function cmd_look() {
	if (!(this instanceof cmd_look))
	    return new cmd_look();
	
	this.name = 'look';
	this.look_room = function(sender) {
		var env = FUNCTIONS.environment(sender);
		if (!env || !(env instanceof fm.MObject)) {
			FUNCTIONS.tell_object(sender, "你的四周灰蒙蒙的一片，什么也没有。\n"); //TODO add all strings to global
			return 1;
		}
			
		var avoid = {};
		avoid[sender.id] = 1;
		FUNCTIONS.message_scene(sender, env.look_response(avoid));
		return 1;
	};
	
	this.look_living = function(sender, target) {
		
	}
	
	this.look_item = function(sender, target) {
		
	};
	
	this.look_room_item = function(sender, target) {
		
	};
	
	this.execute = function(sender, target) {
		if (!target)
			return this.look_room(sender);
		
		var obj = null;
		if ((obj = FUNCTIONS.object_present(target, FUNCTIONS.environment(sender)))
					|| (obj = FUNCTIONS.object_present(target, sender))) {
			if (obj.is_character())
				return this.look_living(sender, obj);
			else
				this.look_item(sender, obj);
		} else
			return this.look_room_item(sender, target);
	};
}
