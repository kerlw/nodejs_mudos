var dbClient = require('./dbClient.js');

var userSchema = dbClient.Schema({
    name: String,
    password: String
});

var User = dbClient.model('tb_user', userSchema, 'tb_user');

User.prototype.findUser = function (name, pass, callback) {
    console.log('para=' + name + pass);
    return User.findOne({'name':name, 'password':pass}).exec(callback);
}

module.exports = User;
