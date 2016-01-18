(function(r){
	_cmds['go'] = r('./std/go.js')();
	_cmds['say'] = r('./std/say.js')();
	_cmds['look'] = r('./std/look.js')();
})(require);