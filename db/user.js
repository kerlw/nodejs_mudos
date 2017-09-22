var dbClient = require('./dbClient.js');

var userSchema = dbClient.Schema({
    passport:String,
    password: String
});

var User = dbClient.model('tb_user', userSchema, 'tb_user');

User.prototype.add = function (passport, password, callback) {
    logger.debug('addUser ' + passport + password);
    var user = new User({
        passport:passport,
        password: password
    });

    user.save(callback);
}

User.prototype.update = function (passport, password, callback) {
    logger.debug('updateUser ' + passport + password);
    var query = {'passport':passport};
    User.update(query, {'password':password}).exec(callback);
}

User.prototype.findOne = function (passport, callback) {
    logger.debug('findUser ' + passport);
    return User.findOne({'passport':passport}).exec(callback);
}

User.prototype.updateCookie = function (passport, cookie, callback) {
    logger.debug('updateUserCookie ' + passport + cookie);
    var query = {'passport':passport};
    User.update(query, {'cookie':cookie}).exec(callback);
}

module.exports = User;
