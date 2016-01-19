(function(r) {
	global._cmds = {};
	global.FUNCTIONS = {};
	global._objs = { 'players' : {}, 'rooms': {}, 'item' : {} };
	
	global.FLAGS = {
			O_HEART_BEAT : 0x01,
			O_IS_WIZARD : 0x02,
			O_LISTENER : 0x04,
	};
	
	global.ROOM_PATH = __dirname + '/data/room/';
	
	var fm = r('./framework');
	global._objs.rooms['office'] = fm.ROOM.load(ROOM_PATH + "office.json"); 
	global._objs.rooms['meeting-room-a'] = fm.ROOM.load(ROOM_PATH + "meeting-room-a.json");
	
	r('funs');
	r('cmds');
})(require);