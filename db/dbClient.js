var mongoose = require('mongoose');
var options = {  
    server: {
        auto_reconnect: __config.db.autoReconnect,
        poolSize: __config.db.poolSize
    }
};

mongoose.connect(__config.db.url, options, function (err) {
    if (!err) {
        console.log("connected to mongoDB succeed.");
    } else {
        throw err;
    }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error:'));
db.once('open', function callback () {
    console.log('mongoose open success.');
});

module.exports = mongoose;
