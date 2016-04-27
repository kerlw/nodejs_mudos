(function(r){
	
	var playerd = function() {
		if (!(this instanceof playerd))
			return new playerd();
	};
	
	playerd.prototype.init_player_status = function(data) {
		var vitality = 10 + data.con * 2,
			fw = Math.floor(200 * data.con / 30 + 300 * data.str / 30);
		data.hp = {
				vitality : vitality,
				eff_vita : vitality,
				max_vita : vitality,
				
				stamina : 100,
				eff_stm : 100,
				max_stm : 100,
				
				force : 0,
				eff_force : 0,
				max_force : 0,
				
				food : fw,
				max_food : fw,
				water : fw,
				max_water : fw
		}
	}
	
	playerd.prototype.create_character = function(data, callback) {
		if (typeof(callback) !== 'function')
			callback = null;
		
		var charDB = new (r('db').Character)();
		charDB.addChar(data, function(err, charId) {
			if (err) {
				if (callback)
					callback(err);
				return;
			}
			
			data.id = charId;
			_daemons.playerd.init_player_status(data);
			charDB.addStatus(data, function(err) {
				if (callback)
					callback(err);
			});
		});
	}
	
	playerd.prototype.query_character = function(passport, callback) {
		if (typeof(callback) !== 'function')
			callback = null;

        var charDb = new (r('db').Character)();
        charDb.findOneChar(passport, function(err, model) {
        	if (err) {
				console.log('[ERROR] charDb findOne got err: ' + err);
				if (callback)
					callback(err);
        		return;
        	}
        	
        	if (!model) {
        		if (callback)
        			callback(err);
        		return;
        	}
        	
        	var ret = model;
        	charDb.findOneStatus(ret.id, function(err, status) {
        		if (err || !status) {
        			if (callback)
        				callback(err);
        			return;
        		}
        		
        		ret.hp = status.hp;
        		ret.start_room = status.start_room;
        		ret.kv_flags = status.kvs;
        		if (callback) 
        			callback(err, ret);
        	});
        });
	}
	
	playerd.prototype.save_status = function(player) {
		var charDb = new (r('db').Character)();
		var status = {
				id : player.id,
				hp : {
					vitality : player.vitality,
					eff_vita : player.eff_vitality,
					max_vita : player.max_vitality,
					stamina : player.stamina,
					eff_stm : player.eff_stamina,
					max_stm : player.max_stamina,
					force : player.force,
					eff_force : player.eff_force,
					max_force : player.max_force,
					water : player.water,
					max_water : player.max_water,
					food : player.food,
					max_food : player.max_food
				},
				startroom : player.start_room,
				kvs : player.kv_flags
		};
		cahrDb.updateStatus();
	}

	module.exports = playerd;
	
})(require);