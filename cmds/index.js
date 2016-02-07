(function(r){
	var fs = r('fs'),
		path = r('path');

	function load(dir) {
		var files = fs.readdirSync(dir);
		files.forEach(function(file) {
			var pathname = path.join(dir, file),
				stat = fs.lstatSync(pathname),
				fname = path.parse(file).name;

			if (stat.isDirectory())
				return load(pathname);

			if (file === 'index.js' || file === 'pakage.json')
				return;
		
			if (!stat.isFile() || path.extname(file) !== '.js')
				return;

			global._cmds[fname] = new (r(pathname))();		
		});
	}

	load(__dirname);	
})(require);