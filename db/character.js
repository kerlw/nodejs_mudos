var dbClient = require('./dbClient.js');

var charSchema = new dbClient.Schema({
    passport:String,
    nickname: String,
    gender: String,
    str: Number,//strength
    con: Number,//constitution
    int: Number,//intelligence
    apc: Number,//appearance
    lck: Number,//luck
    cor: Number,//courage
    createdTm : { type : Date, 'default' : Date.now }
});

var statusSchema = new dbClient.Schema({
	charId : String,
	mudage : Number,
	
	hp : {
		vitality : Number,
		eff_vita : Number,
		max_vita : Number,
		stamina : Number,
		eff_stm : Number,
		max_stm : Number,
		force : Number,
		eff_force : Number,
		max_force : Number,
		food : Number,
		max_food : Number,
		water : Number,
		max_water : Number
	},
	startroom : String,
	kvs : String
});


var Character = function() {
	if (!(this instanceof Character))
		return new Character();
	
	this.charDb = dbClient.model('tb_character', charSchema, 'tb_character');
	this.stDb = dbClient.model('tb_char_status', statusSchema, 'tb_char_status');
}

Character.prototype.addChar = function (data, callback) {
    var character = new this.charDb({
        passport : data.passport,
        nickname: data.nickname,
        gender: data.gender,
        str: data.str,
        con: data.con,
        int: data.int,
        apc: data.apc,
        lck: data.lck,
        cor: data.cor,
    });

    character.save(function(err) {
    	callback(err, character.id);
    });
}

Character.prototype.updateChar = function (data, callback) {
	if (!data.id)
		return;
	
    var query = {'_id' : new dbClient.Schema.Types.ObjectId(data.id)},
    	content = {};
    for (var k in data) {
    	if (charSchema[k])
    		content[k] = data[k];
    }
    Character.update(query, content).exec(callback);
}

Character.prototype.addStatus = function (data, callback) {
	var status = new this.stDb({
		charId : data.id,
		mudage : 0,
		hp : data.hp,
		start_room : data.start_room,
		kvs : data.kv_flags
	});
	status.save(callback);
}

Character.prototype.updateStatus = function (data, callback) {
	if (!data.id)
		return;
	
	var query = {'charId' : data.id},
		content = {};
	for (var k in data) {
		if (statusSchema[k])
			content[k] = data[k]
	}
	this.stDb.update(query, content).exec(callback);
}

Character.prototype.findOneChar = function (passport, callback) {
    return this.charDb.findOne({'passport':passport}, callback);
}

Character.prototype.findOneStatus = function (charId, callback) {
	return this.stDb.findOne({'charId' : charId}, callback);
}

module.exports = Character;
