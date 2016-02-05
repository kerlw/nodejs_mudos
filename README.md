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


 