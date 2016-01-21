(function() {
	function $isFunction(obj) {
		return typeof obj === 'function';
	}

	function create(constructor, base) {
		if (!$isFunction(base) || !$isFunction(constructor))
			return null;
		
		var Class = function() {
			"use strick"
			
			base.apply(this, arguments);
			constructor.apply(this, arguments);
		}
		
		var F = function() {};
		F.prototype = base.prototype;
		Class.prototype = new F();
		Class.prototype.constructor = Class;
		Class.base = base;
		
		return Class;
	}

	if (typeof module !== 'undefined') {
		module.exports = create;
	} else if (typeof window !== 'undefined') {
		window.extend = create;
	}
})();