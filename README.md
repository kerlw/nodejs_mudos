# nodejs_mudos

Use node.js to implement a mudos, sounds great, doesn't it ?

Make a H5 mud, play mud on mobile phones, I like it!

Trying to study node.js with this project.

## commands
go
look
chat

## functions
tell_object(who, msg, type)
### Protocol: message type ###
| type | message content |
| ------ | ------------------------ |
|room| a json object descript the room/environment.
|resp | response to commands.
|chat | a json object contains chat messages.

environment(obj)

remove_sent(obj, dest)

move_object(obj, dest)


## Character attribute
### Basic attribute
|name|range|comment|
| ------- | ------ | ------------ |
| str | [10-30] | strength
| con |  [10-30] | strength

##Skills
basic skills are defined in framework.SKILL:
```
skill.base_skills = {
		"unarmed" : "拳脚",
		"sword":	"剑法",
		"blade":	"刀法",
		"stick":	"棍法",
		"staff":	"杖法",
		"throwing":	"暗器",
		"force":	"内功",
		"parry":	"招架",
		"dodge":	"轻功",
		"spells":	"法术",
		"whip" :	"鞭法",
		"spear":	"枪法",
		"axe":      "斧法",
		"mace":     "锏法",
		"fork":		"叉法",
		"rake":		"钯法",
//		"archery":	"弓箭",
		"hammer":	"锤法",
		"literate": "读书识字"
};
```


## How to start
create mongodb by using docker:

### MongoDb
```
docker run -tid --name mudos-mongo \
-p 27017:27017 \
-e MONGO_INITDB_ROOT_USERNAME={root_user} \
-e MONGO_INITDB_ROOT_PASSWORD={root_pwd} \
-e MONGO_INITDB_DATABASE=mudos \
--restart always \
--volume ${mudos_mongo_datadir}:/data/db \
mongo
```
### MongoDbExpress
```
 docker run -tid --link mudos-mongo:mongo \
 -p 8081:8081 \
-e ME_CONFIG_MONGODB_ADMINUSERNAME={root_user} \
-e ME_CONFIG_MONGODB_ADMINPASSWORD={root_pwd} \
--name mongo-web \
mongo-express
```

### How to play
start node server:
```
npm install
node index.js
```
Then you could use browser to play this mud
| address | comment |
| ------- | ------- |
|http://localhost:3000 | enter the mud world |
|http://localhost:3000/admin | visit the admin site |
|http://localhost:3000/editor | visit the room editor |


 