module.exports = cmd_hp;

var fm = require('framework');

function cmd_hp() {
	if (!(this instanceof cmd_hp))
		return new cmd_hp();
}

cmd_hp.prototype.execute = function(sender, arg) {
	//TODO for wizard, could see other's hp
	if (!sender || !(sender instanceof fm.CHAR))
		return;
	
	var ret = {
			id : sender.id,
			vlt : sender.vitality,
			evlt : sender.eff_vitality,
			mvlt : sender.max_vitality,
			smt : sender.stamina,
			esmt : sender.eff_stamina,
			msmt : sender.max_stamina,
			frc : sender.force,
			efrc : sender.eff_force,
			mfrc : sender.max_force
	};
	FUNCTIONS.message("hp", ret, sender);
}