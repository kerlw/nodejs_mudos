(function(win) {
	'use strict';
	
	$('#submit').on('click', function() {
	
		
		var info = {
			passport : $('#passport').val(),
			nickname : $('#fullname').val(),
			gender : $('input:radio[name=gender]:checked').val(),
			str : $('#strength').val(),
			con : $('#constitution').val(),
			int : $('#intelligence').val(),
			apc : $('#apperance').val(),
			lck : $('#luck').val(),
			cor : $('#courage').val(),
		};
		$.ajax({
			type : 'POST',
			url : '/ucenter?action=createCharacter',
			dataType : 'json',
			data : info,
			success : function(data) {
				console.log(data);
				if (data.code != 200) {
					alert(data.msg);
				} else {
					alert('ok');
				}
			},

		});
	});

}(window));