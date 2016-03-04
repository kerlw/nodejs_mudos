module.exports = cmd_look;

var fm = require('framework');

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
		FUNCTIONS.message_scene(sender, env.look_response(sender, avoid));
		return 1;
	};
	
	this.look_living = function(sender, target) {
		if (!target)
			return;
		
		var obj = FUNCTIONS.present(target, FUNCTIONS.environment(sender));
		if (!obj)
			return FUNCTIONS.message_interactive(sender, "目标已经离开了。");
			
		var ret = {
				id : obj.id,
				name : obj.name,
				desc : obj.desc,
				type : obj.look_type
		}
		
		if (obj instanceof fm.NPC) {
			switch (obj.look_type) {
			case 'vender': 
				ret.goods = obj.list_goods();
				break;
			case 'master':
				ret.lessons = obj.list_lessons();
				break;
			}
			
			ret.inquiries = obj.query_inquiry(sender);
		}

		return FUNCTIONS.message_interactive(sender, ret);
	}
	
	this.look_item = function(sender, target) {
		
	};
	
	this.look_room_item = function(sender, target) {
		
	};
	
	this.execute = function(sender, target) {
		if (!target)
			return this.look_room(sender);
		
		var obj = null;
		if ((obj = FUNCTIONS.present(target, FUNCTIONS.environment(sender)))
					|| (obj = FUNCTIONS.present(target, sender))) {
			if (obj.is_character())
				return this.look_living(sender, obj);
			else
				return this.look_item(sender, obj);
		} else
			return this.look_room_item(sender, target);
	};
}
