(function(r) {
	global._cmds = {};
	global._daemons = {};
	global._std = {};
	global.FUNCTIONS = {};
	global._objs = { 'players' : {}, 'rooms': {}, 'npcs' : {}, 'areas' : {}, 'items' : {}, 'skills' : {} };
	
	global.FLAGS = {
			O_HEART_BEAT : 0x01,
			O_IS_WIZARD : 0x02,
			O_LISTENER : 0x04,
			O_ENABLE_COMMANDS : 0x08
	};
	
	global.CND_FLAGS = {
			CND_NO_HEAL_UP : 0x01
	}
	
	global.HB_ENGINE = r('heartbeat')();
	global.HB_ENGINE.init();
	
	global.DATA_PATH = global.__BASE_PATH + global.__config.data_dir;
	
	
	var fm = r('framework'),
		fs = r('fs'),
		path = r('path');
	
	r('std');
	//init functions
	r('funs');
	//init commands
	r('cmds');
	//init daemons
	r('daemons');
	
	r(path.join(global.DATA_PATH, 'fun/init.js'));
	
	//init skills, this must be done before init room, because nps need skills
	_daemons.skilld.init_all_skills(path.join(global.DATA_PATH, 'skill'))
	
	//init rooms
	init_rooms(global.DATA_PATH);

	
	///////////////////////////////////////////////////////////
	//  Funcitons
	///////////////////////////////////////////////////////////
	// load all rooms from ROOM_PATH
	function init_rooms(basedir, prefix) {
		prefix = prefix || '';
		var dir = path.normalize(path.join(basedir, prefix));
	
		var files = fs.readdirSync(dir);
		files.forEach(function(file) {
			var pathname = path.join(dir, file),
				stat = fs.lstatSync(pathname),
				fname = path.parse(file).name;
			
			if (stat.isDirectory()) {
				if (fname === 'item' || fname === 'npc' 
						|| fname === 'skill' || fname === 'fun'
						)
					return;
				
				init_rooms(basedir, path.join(prefix, file));
			} else {
				var id = path.join(prefix, path.parse(file).name),
					areaId = prefix,
					room = null;
				
				// fix id's format on windows platform
				if (path.sep === '\\')
					id = id.replace('\\', '/');
				
				if (areaId === '')
					areaId = 'no_area';
				
				if (path.extname(file) === '.json') {
					room = fm.ROOM.load(pathname);
				} else if (path.extname(file) === '.js') {
					room = new (r(pathname))();
				}
				if (!room)
					return;
				
				if (room.query_tmp('lazy_init'))
					room.lazy_init();
				global._objs.rooms[id] = room;
				global._objs.areas[areaId] = global._objs.areas[areaId] || new Array();
				global._objs.areas[areaId].push(id);
			}
		});
	}

})(require);