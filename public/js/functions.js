function exchange_color(msg) {
	// msg = 'xxx say:$(HIR BOLD) test\n msg $NOR\n $(MAG BLINK)ha$NOR ha';
	var regRN = /\n/g;
	msg = msg.replace(regRN, "<br />");

	var tagReg = /\$\(([A-Z\s]+)\)/g;
	var tags = msg.match(tagReg);
	// console.log(tags);
	var index = 0;
	var tagWhole;
	while (tags != null && (tagWhole = tags[index++])) {
		// console.log(tagWhole);
		var tagWholeReg = /^\$\(([A-Z\s]+)\)$/g;
		var tag = tagWholeReg.exec(tagWhole)[1];
		// console.log(tag);
		msg = msg.replace('\$(' + tag + ')', '<span class="'
				+ tag.toLowerCase() + '">');
		msg = msg.replace('\$NOR', '</span>');
	}

	// console.log(msg);
	return msg;
}