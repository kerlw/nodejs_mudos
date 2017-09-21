(function(r) {
    global.logger = r('log4js').getLogger();
    global.logger.level = "debug";

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

    var fm = r('framework'),
        fs = r('fs'),
        path = r('path');

    global.HB_ENGINE = r('heartbeat')();

	global.HB_ENGINE.init();
    global.DATA_PATH = path.normalize(path.join(global.__BASE_PATH, global.__config.data_dir));
    global.MAP_PATH = path.normalize(path.join(global.DATA_PATH, __config.map_dir));

    console.log('DATA_PATH initialized to {0}', global.DATA_PATH);
    console.log('MAP_PATH initialized to {0}', global.MAP_PATH);

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
	init_rooms(path.join(global.DATA_PATH, 'map'));

	
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

				//
				//尝试从加载的room去判断哪些是继承自base的，哪些是重载或自己特有的属性和方法，参考下面代码.
				//Object.getOwnPropertyNames(room)可以列出room的所有属性
				//Object.getOwnPropertyNames(room.__proto__)可以列出room的所有方法
				//----------------------------------------------------
                // if (file === 'nandajie01.json') {
                //     console.log(room.name + "  room property: ")
                //     console.log(room.__proto__ ? Object.getOwnPropertyNames(room.__proto__).filter(function(key) {
                //     		console.log(key + ": " +  room.__proto__[key] + "  " + room.__proto__.base[key] + " base is : " + room.__proto__.base);
                //     		return  room.__proto__[key] !== room.__proto__.base[key];
					// 	}) : "null");
                // }
				//----------------------------------------------------

                global._objs.rooms[id] = room;
				global._objs.areas[areaId] = global._objs.areas[areaId] || new Array();
				global._objs.areas[areaId].push(id);
			}
		});
	}

})(require);