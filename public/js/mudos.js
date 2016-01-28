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
		if (!$me.attr('enabled') || $me.attr('direction') === '') {
			return;
		}

		socket.emit('cmd', "go " + $me.attr('direction'));
	});

	// **-------------------------------------------------------------
	// ** Function
	// **-------------------------------------------------------------

	function refresh_move_controller(name,exits) {
		$('.mc-btn').attr('direction', '').attr('enabled', 0).empty();
        $('#r2c2').text(name);
        
        exits = exits || {};
        var $ele;
        for (var dir in exits) {
        	$ele = null;
        	switch (dir) {
        	case 'east': $ele = $('#r2c3');break;
        	case 'west': $ele = $('#r2c1');break;
        	case 'north': 
        	case 'up':
        		$ele = $('#r1c2');break;
        	case 'south': 
        	case 'down':
        		$ele = $('#r3c2');break;

        	case 'northeast': $ele = $('#r1c3');break;
        	case 'northwest': $ele = $('#r1c1');break;
        	case 'southeast': $ele = $('#r3c3');break;
        	case 'southwest': $ele = $('#r3c1');break;

        	}
        	if ($ele)
        		$ele.text(exits[dir].name).attr('direction', dir).attr('enabled', 1);
        }
	}
}(window));
