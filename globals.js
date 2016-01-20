(function(r) {
	global._cmds = {};
	global.FUNCTIONS = {};
	global._objs = { 'players' : {}, 'rooms': {}, 'items' : {} };
	
	global.FLAGS = {
			O_HEART_BEAT : 0x01,
			O_IS_WIZARD : 0x02,
			O_LISTENER : 0x04,
	};
	
	global.HB_ENGINE = r('heartbeat')();
	global.HB_ENGINE.init();
	
	global.ROOM_PATH = global.__BASE_PATH + global.__config.room_dir;
	
	var fm = r('./framework'),
		fs = r('fs');
	
	// load all rooms from ROOM_PATH
	function init_rooms(basedir, prefix) {
		prefix = prefix || "";
		var dir = basedir + "/" + prefix;
	
		var files = fs.readdirSync(dir);
		files.forEach(function(file) {
			var path = ROOM_PATH + "/" + file,
				stat = fs.lstatSync(path);
			
			if (stat.isDirectory()) {
				init_rooms(basedir, prefix + file + "/");
			} else {
				var id = prefix + file.replace('.json', '');
				global._objs.rooms[id] = fm.ROOM.load(dir + "/" + file);
			}
		});
	}
	
	//init rooms
	init_rooms(ROOM_PATH);
			
//	global._objs.rooms['office'] = fm.ROOM.load(ROOM_PATH + "office.json"); 
//	global._objs.rooms['meeting-room-a'] = fm.ROOM.load(ROOM_PATH + "meeting-room-a.json");
	
	//init functions
	r('funs');
	
	//init commands
	r('cmds');
})(require);