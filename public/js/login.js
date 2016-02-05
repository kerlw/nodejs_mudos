(function(win) {
	'use strict';
	
	$('#login').on('click', function() {
		
		var info = {
			passport : $('#passport').val(),
			password : $('#password').val()
		};
		$.ajax({
			type : 'POST',
			url : '/ucenter?action=login',
			dataType : 'json',
			data : info,
			success : function(data) {
				if (data.code == 200) {
					window.location.href='/';
				} else {
					$('#msg').text(data.msg).show();
				}
			}
		});
	});

	$('#register').on('click', function() {
		
		var info = {
			passport : $('#passport').val(),
			password : $('#password').val()
		};
		$.ajax({
			type : 'POST',
			url : '/ucenter?action=register',
			dataType : 'json',
			data : info,
			success : function(data) {
				if (data.code == 200) {
					window.location.href='/character';
				} else {
					$('#msg').text(data.msg).show();
				}
			}

		});
	});

}(window));