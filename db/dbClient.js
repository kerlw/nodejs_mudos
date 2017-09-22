var mongoose = require('mongoose');
var options = {  
    server: {
        auto_reconnect: __config.db.autoReconnect,
        poolSize: __config.db.poolSize
    },
    auth: {
        user : "mudos",
        pass : "mudos"
    }
};

var db = mongoose.createConnection(__config.db.url, options, function (err) {
                if (!err) {
                    logger.debug("[DB] connected to mongoDB succeed.");
                } else {
                    throw err;
                }
            });

db.on('error', console.error.bind(console, '[DB] mongoose connection error:'));
db.once('open', function callback () {
    logger.debug('[DB] mongoose open success.');
});

module.exports = mongoose;
