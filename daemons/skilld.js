module.exports = skilld;

var fs = require('fs'), 
	path = require('path');

function skilld() {
	if (!(this instanceof skilld))
		return new skilld();
}

skilld.prototype.init_all_skills = function(dir) {
	var files = fs.readdirSync(dir);
	files.forEach(function(file) {
		var pathname = path.join(dir, file), 
			stat = fs.lstatSync(pathname), 
			fname = path.parse(file).name;

		var skill = null;
		if (stat.isFile()) {
			skill = new (require(pathname))();
			if (skill) {
				_objs.skills[fname] = skill;
                logger.debug("[SKILL] adding skill " + skill.name);
			}
		} else if (stat.isDirectory()) {
			var skill = new (require(path.join(pathname, 'index.js')))();
			if (skill) {
				var performs = fs.readdirSync(pathname);
				performs.forEach(function(perform) {
					var pname = path.join(pathname, perform)
					st = fs.lstatSync(pathname), fn = path.parse(file).name;
					
					if (st.isDirectory() || fn == 'index')
						return;
					
					skill[fn] = require(pname)();
				});
                logger.debug("[SKILL] adding skill " + skill.name);
				_objs.skills[fname] = skill;
			}
		}
	});
}

skilld.prototype.skill_taught = function(teacher, me, skill) {
	
}

skilld.prototype.query_action = function(me, skill, lv, other) {
	return skill.action(me, lv, other);
}

skilld.prototype.query_cost = function(me, skill, lv, other) {
	return skill.cost(me, lv, other);
}

skilld.prototype.query_damage = function(me, skill, lv, other) {
	return skill.damage(me, lv, other);
}
