(function(r){
	_cmds['go'] = r('./std/go.js')();
	_cmds['chat'] = r('./std/chat.js')();
	_cmds['look'] = r('./std/look.js')();
	_cmds['fight'] = r('./std/fight.js')();
})(require);