(function(win) {
	'use strict';
	
	$('#submit').on('click', function() {
	
		var passport = $('#passport').text();
		var info = {
			passport : passport,
			nickname : $('#fullname').val(),
			gender : $('input:radio[name=gender]:checked').val(),
			str : $('#strength').val(),
			con : $('#constitution').val(),
			int : $('#intelligence').val(),
			apc : $('#apperance').val(),
			lck : $('#luck').val(),
			cor : $('#courage').val(),
		};
		console.log(info);
		$.ajax({
			type : 'POST',
			url : '/ucenter?action=createCharacter',
			dataType : 'json',
			data : info,
			success : function(data) {
				console.log(data);
				if (data.code != 200) {
					console(data.msg);
				} else {
					window.location.href='/';
				}
			},

		});
	});

}(window));