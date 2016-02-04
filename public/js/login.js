(function(win) {
	'use strict';
	
	$('#login').on('click', function() {
		var passport = $('#passport').val();
		var password = $('#password').val();
		
		var info = {
			passport : passport,
			password : password
		};
		$.ajax({
			type : 'POST',
			url : '/ucenter?action=login',
			dataType : 'json',
			success : function() {
				console.log('ok');
			},

			data : info
		});
	});

	$('#register').on('click', function() {
		var user = $('#passport').val();
		var pwd = $('#password').val();
		
		var info = {
				name : user,
				passwd : pwd
		};
		$.ajax({
			type : 'POST',
			url : '/ucenter?action=register',
			dataType : 'json',
			success : function(data) {
				if (data.code != 200) {
					$('#msg').text(data.msg).show();
				} else {
					console.log('ok');
				}
			},
			data : info
		});
	});

}(window));