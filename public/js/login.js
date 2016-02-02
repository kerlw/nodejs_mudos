(function(win) {
	'use strict';
	
	$('#login').on('click', function() {
		var user = $('#passport').val();
		var pwd = $('#password').val();
		
		var info = {
				name : user,
				passwd : pwd
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
			success : function(msg) {
				console.log('ok');
			},
			data : info
		});
	});

}(window));