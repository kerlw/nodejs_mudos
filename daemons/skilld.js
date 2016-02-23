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
				console.log("[SKILL] adding skill " + skill.name);
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
				if (fname != skill.name) {
					console.log("[WARNING] detected a skill's name(" + skill.name
							+ ") is differet to folder's name(" + fname + ")");
				}
				console.log("[SKILL] adding skill " + skill.name);
				_objs.skills[fname] = skill;
			}
		}
	});
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
