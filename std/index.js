(function(r) {
	var fs = r('fs'), 
		path = r('path');
	
	function load_from_dir(dir) {
		var files = fs.readdirSync(dir);

		files.forEach(function(file) {
			if (file === 'index.js' || file === 'package.json')
				return;

			var pathname = path.join(dir, file),
				stat = fs.lstatSync(pathname);
				
			if (stat.isDirectory())	{
				load_from_dir(path.join(dir, file));
				return;
			} else if (!stat.isFile() || path.extname(file) !== '.js')
				return;
			
			load(pathname);
		});
	}

	function load(pathname) {
		var stat = fs.lstatSync(pathname), 
			fname = path.parse(pathname).name;
		global._std[fname] = r(pathname);
	}

	load_from_dir(__dirname);
})(require);