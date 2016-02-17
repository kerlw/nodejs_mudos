var dbClient = require('./dbClient.js');

var questSchema = dbClient.Schema({
    userId : String,
    questId : String,
    publisherId : String,
    publisherName : String,
    questJsonStr : String,
    status : Number,	// 0 : doing, 1 : done, 2 : abandoned
});

var QuestModel = dbClient.model('tb_quest', questSchema, 'tb_quest');

var QuestDB = function() {
	'use strict'
}

QuestDB.prototype.add = function (publisher, player, quest, callback) {
    var quest = new QuestModel();
    quest.save(callback);
}

QuestDB.prototype.update = function (player, quest, callback) {
    var query = {'userId' : player.id, 'questId' : quest.id};
    QuestModel.update(query, JSON.stringfy(quest)).exec(callback);
}

QuestDB.prototype.find = function (playerId, callback) {
    return QuestModel.find({'passport':passport}).exec(callback);
}

module.exports = QuestDB;
