cd #mongodb_home
./run.sh
./bin/mongo

use mudos;

db.dropUser("mudos");
db.createUser({user:"mudos",pwd:"mudos",roles:["readWrite","userAdmin"]});
db.auth('mudos','mudos');

db.createCollection('tb_user');
db.tb_user.insert({'name':'admin','password':'111111'});
db.tb_user.find();


停止：
use admin;
db.shutdownServer();