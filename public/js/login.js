(function(win) {
	'use strict';
	
	$('#login').on('click', function() {
		
		var passport = $('#passport').val();
		
		var info = {
			passport : passport,
			password : $('#password').val()
		};
		$.ajax({
			type : 'POST',
			url : '/ucenter?action=login',
			dataType : 'json',
			data : info,
			success : function() {
				window.location.href='/';
			}
		});
	});

	$('#register').on('click', function() {
	
		var passport = $('#passport').val();
		
		var info = {
			passport : passport,
			password : $('#password').val()
		};
		$.ajax({
			type : 'POST',
			url : '/ucenter?action=register',
			dataType : 'json',
			data : info,
			success : function(data) {
				if (data.code == 200) {
					window.location.href='/register';
				} else {
					$('#msg').text(data.msg).show();
				}
			}

		});
	});

}(window));