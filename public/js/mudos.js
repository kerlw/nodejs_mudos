(function(win) {
	'use strict';

	var socket = io();

	/**
	 * $('form').submit(function(){ var str = $('#m').val(); if (str.slice(0, 3)
	 * === 'cmd') { socket.emit('cmd', str.slice(4)); } else socket.emit('chat
	 * message', str); $('#m').val(''); return false; });
	 */
	socket.on('resp', function(msg) {
		$('#message').append('<br>' + msg);
	});
	socket.on('fail', function(msg) {
		$('#message').append('<br>' + msg);
	});
	socket.on('room', function(msg) {
		refresh_move_controller(msg.name, msg.exits);
		$('.room-title').text(msg.name);
		$('#room_desc').text(msg.desc);
		$('#env_objs').empty();
		if (msg.objs) {
			for ( var name in msg.objs) {
				$('#env_objs').append(
						$('<li value=\'' + msg.objs[name] + '\'>').text(name));
			}
		}
	});

	$('.mc-btn').on('click', function () {
        var $me = $(this);
		if ($me.attr('direction') === '') {
			return;
		}

		socket.emit('cmd', "go " + $me.attr('direction'));
	});

	// **-------------------------------------------------------------
	// ** Function
	// **-------------------------------------------------------------

	function refresh_move_controller(name,exits) {
        $('#r2c2').text(name);

	}
}(window));
