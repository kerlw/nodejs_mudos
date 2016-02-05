(function(r) {
	var fs = r('fs'),
	path = r('path');
	
	var files = fs.readdirSync(__dirname);
	files.forEach(function(file) {
		var pathname = path.join(__dirname, file),
			stat = fs.lstatSync(pathname),
			fname = path.parse(file).name;
		
		if (!stat.isDirectory())
			return;
		
		console.log(pathname + " " + path.join(pathname, 'index.js'));
		var skill = new (r(path.join(pathname, 'index.js')))();
		if (skill) {
			var performs = fs.readdirSync(pathname);
			performs.forEach(function(perform) {
				var pname = path.join(pathname, perform)
					st = fs.lstatSync(pathname),
					fn = path.parse(file).name;
				
				if (st.isDirectory() || fn == 'index')
					return;
				
				skill[fn] = r(pname)();
			});
			if (fname != skill.name) {
				console.log("[WARNING] detected a skill's name("+ skill.name + 
						") is differet to folder's name(" + fname + ")");
			}
			console.log("[SKILL] adding skill " + skill.name);
			_objs.skills[fname] = skill;
		}
	});

})(require);