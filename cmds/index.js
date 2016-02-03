(function(r){
	_cmds['go'] = r('./std/go.js')();
	_cmds['chat'] = r('./std/chat.js')();
	_cmds['look'] = r('./std/look.js')();
	_cmds['fight'] = r('./std/fight.js')();
	_cmds['say'] = r('./std/say.js')();
	_cmds['hp'] = r('./std/hp.js')();
	_cmds['kill'] = r('./std/kill.js')();
	
	_cmds['perform'] = r('./skill/perform.js')();
	_cmds['enable'] = r('./skill/enable.js')();
})(require);