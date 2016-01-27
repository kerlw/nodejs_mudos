(function(r){
	var fs = r('fs'),
		path = r('path');
	
	//TODO auto load all js files in this directory.
	global._daemons.combat = r('./combatd.js')
	

})(require);