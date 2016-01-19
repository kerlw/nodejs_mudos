(function(r) {
	global._cmds = {};
	global.FUNCTIONS = {};
	global._objs = { 'players' : {}, 'rooms': {}, 'item' : {} };
	
	global.FLAGS = {
			O_HEART_BEAT : 0x01,
			O_IS_WIZARD : 0x02,
			O_LISTENER : 0x04,
	};
	
	global.ROOM_PATH = '/data/room';
	
	var fm = r('./framework');
	global._objs.rooms['/data/room/office'] = fm.ROOM.load(__dirname + ROOM_PATH + "/office.json"); 
	
	r('funs');
	r('cmds');
})(require);