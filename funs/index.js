(function(r){
	var funcs = r('./functions.js');
	
	FUNCTIONS.tell_object = funcs.tell_object;
	FUNCTIONS.environment = funcs.environment;
	FUNCTIONS.remove_sent = funcs.remove_sent;
	FUNCTIONS.move_object = funcs.move_object;
	
})(require);