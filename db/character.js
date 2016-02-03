var dbClient = require('./dbClient.js');

var characterSchema = dbClient.Schema({
    passport:String,
    nickname: String,
    str: Number,//strength
    con: Number,//constitution
    int: Number,//intelligence
    apc: Number,//appearance
    lck: Number,//luck
    cor: Number//courage
});

var Character = dbClient.model('tb_character', characterSchema, 'tb_character');

Character.prototype.add = function (passport, nickname, str, con, int, apc, lck, cor, callback) {
    console.log('addCharacter ' + passport + nickname + str + con + int + apc + lck + cor);
    var character = new Character({
        passport:passport,
        nickname: nickname,
        str: str,
        con: con,
        int: int,
        apc: apc,
        lck: lck,
        cor: cor
    });

    character.save(callback);
}

Character.prototype.update = function (passport, nickname, str, con, int, apc, lck, cor, callback) {
    console.log('updateCharacter ' + passport + nickname + str + con + int + apc + lck + cor);
    var query = {'passport':passport};
    Character.update(query, {'nickname':nickname, 'str':str, 'con':con, 'int':int, 'apc':apc, 'lck':lck, 'cor':cor}).exec(callback);
}

Character.prototype.findOne = function (passport, callback) {
    console.log('findCharacter ' + passport);
    return Character.findOne({'passport':passport}).exec(callback);
}

module.exports = Character;
