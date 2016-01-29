(function(win) {
	'use strict';

	var $msgList = $('#message');
	var msgLimit = 1000;
	var socket = io();

	/**
	 * $('form').submit(function(){ var str = $('#m').val(); if (str.slice(0, 3)
	 * === 'cmd') { socket.emit('cmd', str.slice(4)); } else socket.emit('chat
	 * message', str); $('#m').val(''); return false; });
	 */
	socket.on('resp', function(msg) {
		var oldMsg = $msgList.html();
		if (oldMsg.length > msgLimit) {
			oldMsg = oldMsg.substring(oldMsg.length - msgLimit);
			$msgList.html('...' + oldMsg.substring(oldMsg.indexOf('<br>')));
		}
		$msgList.append(msg + '<br>');
		$msgList.scrollTop(9999);

	});
	socket.on('fail', function(msg) {
		$msgList.append(msg + '<br>');
	});
	socket.on('room', function(msg) {
		refresh_move_controller(msg.name, msg.exits);
		$('.room-title').text(msg.name);
		$('#room_desc').text(msg.desc);
		//$('#env_objs').empty();
		if (msg.objs) {
			for ( var name in msg.objs) {
				$('#env_objs').append($('<li>').attr('class', 'room-obj').attr('value', msg.objs[name]).text(name));
			}
			// bind click handle function
			$('.room-obj').on('click', function() {
				//TODO here just use fight to test fight functions. it should be 
				// 'look', and we should show a panel to handle the 'look' response,
				// because the cmd is async, the panel should has a timestamp attr
				// and this attr should send to server, and server should response
				// with it.
//				socket.emit('cmd', 'look ' + $(this).attr('value'));
				socket.emit('cmd', 'fight ' + $(this).attr('value'));
			});
		}
	});

    $('.obj').on('click', function () {
		var $me = $(this);
		$me.modal();
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
