(function(win) {
	'use strict';
	
	// add a format method to String class
	if (!String.format) {
		String.format = function(format) {
			var args = Array.prototype.slice.call(arguments, 1);
			return format.replace(/{(\d+)}/g, function(match, number) {
				return typeof args[number] != 'undefined' ? args[number]
						: match;
			});
		};
	}

	var $msgList = $('#message');
	var msgLimit = 1000;
	var socket = io();

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
		$('#env_objs').empty();
		if (msg.objs) {
			for ( var id in msg.objs) {
				$('#env_objs').append($('<li>').attr('class', 'room-obj').attr('value', id).text(msg.objs[id]));
			}
			// bind click handle function
			$('.room-obj').on('click', function() {
				//TODO here just use fight to test fight functions. it should be 
				// 'look', and we should show a panel to handle the 'look' response,
				// because the cmd is async, the panel should has a timestamp attr
				// and this attr should send to server, and server should response
				// with it.
//				socket.emit('cmd', 'look ' + $(this).attr('value'));
				socket.emit('cmd', 'kill ' + $(this).attr('value'));
			});
		}
	});
	
	socket.on('hp', function(msg) {
		refresh_hp_panel(msg);
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
	
	//a timer to auto refresh hp panel
	var refresh_hp_timer;
	function refresh_hp_panel(hp) {
		//remove timer at first
		clearTimeout(refresh_hp_timer);
		
		var str = String.format('生命: {0} / {1} ({2}%)<br>', hp.vlt, hp.evlt, (hp.evlt * 100 / hp.mvlt)); 
		str += String.format('体力: {0} / {1} ({2}%)<br>', hp.smt, hp.esmt, (hp.esmt * 100 / hp.msmt));
		if (hp.mfrc > 0)
			str += String.format('内力: {0} / {1} ({2}%)<br>', hp.frc, hp.efrc, (hp.efrc * 100 / hp.mfrc));
		else
			str += String.format('内力: 无<br>');
		$('.obj-info.bs').html(str);
		
		//reset timer
		refresh_hp_timer = setTimeout(function() {socket.emit('cmd', 'hp');}, 5000);
	}
}(window));
