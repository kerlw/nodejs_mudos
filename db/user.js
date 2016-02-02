var mongoose = require('mongoose');
var db = mongoose.connect(__config.db.url);//；连接数据库
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function() {console.log(console, 'connection succeed.')});
var userSchema = mongoose.Schema({
	name: String,
	password: String
}); //  定义了一个新的模型，但是此模式还未和users集合有关联

var User = mongoose.model('tb_user', userSchema);

User.prototype.findUser = function (name, pass, callback) {
  console.log(name + pass);
  return User.find({}, callback);
}

module.exports = User; //  与users集合关联
