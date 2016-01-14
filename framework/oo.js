(function() {
	function $isFunction(obj) {
		return typeof obj === 'function';
	}

	function create(derived, base) {
		if (!$isFunction(base))
			return;
		
		var F = function() {};
		F.prototype = base.prototype;
		derived.prototype = new F();
		derived.prototype.constructor = derived;
		derived.super = base;
	}
	;

	if (typeof module !== 'undefined') {
		module.exports = create;
	} else if (typeof window !== 'undefined') {
		window.Class = create;
	}

})();