(function(r) {
	var fs = r('fs'), 
		path = r('path'), 
		files = fs.readdirSync(__dirname);

	files.forEach(function(file) {
		var pathname = path.join(__dirname, file), stat = fs
				.lstatSync(pathname), fname = path.parse(file).name;

		if (file === 'index.js' || file === 'package.json')
			return;
		if (!stat.isFile() || path.extname(file) !== '.js')
			return;

		var tmp = r(pathname);
		global._std[path.parse(file).name] = tmp;
	});
})(require);