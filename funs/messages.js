(function(r, f) {

	var fm = r('framework');

	/**
	 * $N - my name $n - your name
	 */
	f.message_vision = function(msg, me, you) {
		var str4me, str4you, str4other;
		if (!msg || !me || typeof msg !== 'string')
			return;

		str4me = msg.replace('$N', '你');
		str4other = msg.replace('$N', me.name);
		if (you) {
			str4you = str4other.replace('$n', '你');
			str4other = str4other.replace('$n', you.name);
			str4me = str4me.replace('$n', you.name);
			message("vision", str4you, you);
		}
		message("vision", str4me, me);

		var env = f.environment(me);
		if (env) {
			if (you)
				message("vision", str4other, env, new Array(me, you));
			else
				message("vision", str4other, env, new Array(me));
		}
	}

	f.combat_msg_flag = {};
	f.combat_msg_flag.SHOW_ALL = 0;
	f.combat_msg_flag.SHOW_DAMAGE = 1;
	f.combat_msg_flag.SHOW_BRIEF_DAMAGE = 2;
	f.combat_msg_flag.SHOW_BRIEF_SELF_DAMAGE = 3;
	f.combat_msg_flag.SHOW_NONE = 4;

	f.message_combatd = function(msg, me, you, damage_info) {
		//TODO implement real message_combatd
		return f.message_vision(msg, me, you);
	}

	f.message_scene = function(me, msg) {
		message("room", msg, me);
	}

	f.tell_object = function(ob, msg) {
		if (!ob || !msg)
			return;

		message("tell_object", msg, ob);
	}

	f.tell_room = function(ob, str, exclude) {
		if (ob) {
			message("tell_room", str, ob, exclude);
		}
	}

	f.shout = function(obj, str) {
		message("shout", str, _objs.players, obj);
	}

	f.write = function(obj, msg) {
		message("write", msg, obj);
	}

	f.say = function(ob, str, exclude) {
		if (ob && f.environment(ob)) {
			message("say", str, environment(ob), ob);
		}
	}

	f.message_system = function(msg) {
		message("system", msg, f.users());
	}

	f.message_job = function(msg) {
		message("channel:job", msg, f.users());
	}

	f.notify_fail = function(me, msg) {
		if (me)
			message("fail", msg, me);
	}
	
	f.message = function(clz, msg, target, exclude) {
		message(clz, msg, target, exclude);
	} 

	function message(msgclz, msg, target, exclude) {
		if (!target)
			return;

		if (target.recv_message && typeof target.recv_message === 'function')
			target.recv_message(msgclz, msg, exclude);
		else if (target instanceof fm.ROOM) {
			for ( var id in target.contains) {
				var ob = target.contains[id];
				if (ob && exclude && exclude instanceof Array
						&& exclude.indexOf(ob) >= 0)
					continue;

				if (ob.recv_message && typeof ob.recv_message === 'function')
					ob.recv_message(msgclz, msg);
			}
		}
	}
})(require, global.FUNCTIONS);