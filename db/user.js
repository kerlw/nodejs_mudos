var mongoose = require('mongoose');
var db = mongoose.connect(__config.db.url, function (err) {
    if (!err) {
        console.log("connected to mongoDB succeed.");
    } else {
        throw err;
    }
});

var userSchema = mongoose.Schema({
    name: String,
    password: String
});

var User = mongoose.model('tb_user', userSchema, 'tb_user');

User.prototype.findUser = function (name, pass, callback) {
    console.log('para=' + name + pass);
    return User.findOne({'name':name, 'password':pass}).exec(callback);
}

module.exports = User;
