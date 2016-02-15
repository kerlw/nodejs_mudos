$("document").ready(function(){
	
	var points = {
					total : 60,
					strength : 10,
					constitution : 10,
					intelligence : 10,
					apperance : 10,
					luck : 10,
					courage : 10
				};

	$("#points").text("您当前拥有的属性点数: " + points.total);

	function setPoints($slider, $base){
		if ($slider.val() > Number(points.total) + $base) {
			$base = Number(points.total) + Number($base);
			points.total = 0;
			$slider.val($base).slider("refresh");
		} else {
			points.total = Number(points.total-($slider.val()-$base));
			$base = Number($slider.val());
		}
		return $base;

	};

	$("input.point").change(function(){
		var $me = $(this);
		var $name = $me.attr('name');
		points[$name] = setPoints($me, points[$name]);
		$("#points").text("您当前拥有的属性点数: " + points.total);
	});

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
			cor : $('#courage').val()
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
					$('#toast').text(data.msg).popup('open');
				} else {
					window.location.href='/';
				}
			}

		});
	});

});