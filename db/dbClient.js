var mongoose = require('mongoose');
var assert = require('assert');

var options = {
    server: {
        auto_reconnect: __config.db.autoReconnect,
        poolSize: __config.db.poolSize,
        reconnectTries: Number.MAX_VALUE // 无限重连的节奏
    },
    // auth: {
        user: "mudos",
        pass: "mudos",
    // },
    promiseLibrary: require('bluebird'),
    useMongoClient: true
};

mongoose.connect(__config.db.url, options, function (err) {
    if (!err) {
        logger.debug("[DB] connected to mongoDB succeed.");
    } else {
        throw err;
    }
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, '[DB] mongoose connection error:'));
db.once('open', function callback() {
    var Test = db.model("test-promises", {name: String});
    assert.equal(Test.collection.findOne().constructor, require('bluebird'));
    logger.debug('[DB] mongoose open success.');
});

module.exports = mongoose;
