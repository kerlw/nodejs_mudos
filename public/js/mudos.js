(function(win) {
	'use strict';

	var socket = io();

	/**
	 * $('form').submit(function(){ var str = $('#m').val(); if (str.slice(0, 3)
	 * === 'cmd') { socket.emit('cmd', str.slice(4)); } else socket.emit('chat
	 * message', str); $('#m').val(''); return false; });
	 */
	socket.on('resp', function(msg) {
		$('#messages').append($('<li>').text(msg));
	});
	socket.on('fail', function(msg) {
		$('#messages').append($('<li>').text(msg));
	});
	socket.on('room', function(msg) {
		// TODO refresh_move_controller(msg.name, msg.exits);
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
	// **-------------------------------------------------------------
	// ** Function
	// **-------------------------------------------------------------

}(window));
