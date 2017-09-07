#启停：
cd #mongodb_home
./run.sh

use admin;
db.createUser({user:"admin",pwd:"admin",roles:["readWrite","userAdmin"]});

#关闭服务器
db.shutdownServer();

#进入命令行：
./bin/mongo 
#创建了账号之后用以下命令连接数据库
./bin/mongo 127.0.0.1:27017/mudos -umudos -pmudos

#创建账号：
use mudos;
db.dropUser("mudos");
db.createUser({user:"mudos",pwd:"mudos",roles:["readWrite","userAdmin"]});
db.auth('mudos','mudos');

#数据操作：
db.createCollection('tb_user');
db.tb_user.insert({'name':'admin','password':'111111'});
db.tb_user.find();
db.tb_user.remove({});