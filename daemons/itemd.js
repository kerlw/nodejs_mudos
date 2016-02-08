(function(r){
	var fm  = r('framework');

	var itemd = function() {
		if (!(this instanceof itemd))
			return new itemd();
	};

	itemd.prototype.create_good = function(path) {
		//TODO search std dir
		var pathname = fm.find_file(DATA_PATH, path);
		return new (r(pathname))();
	}
	
	module.exports = itemd;
	
})(require);