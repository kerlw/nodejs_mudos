var InteractionPanel = function($view, socket) {
	'use strict';
	
	this.view = $view;
	this.loadingPanel = $('#loading-panel');
	this.interactionPanel = $('#interaction-panel');
	this.titleView = $('#myModalLabel');
	this.contentView = $('#myModalContent');
	this.inquiryView = $('#inquiries');
	this.interactionView = $('#interactions');
	
	this.socket = socket;
	
	this.isShowing = 0;
	
}

InteractionPanel.prototype.onResponseData = function(msg) {
	if (!msg) {
		$('#loading').html("数据加载异常！");
		setInterval("$('#loading').css('display','none')",2000);
		return;
	}
	//TODO check interactive id

	if (typeof msg === 'string') {
		$('#myModalLabel').text(msg);
		return;
	}
	
	this.setTitle(msg.name);
	this.setContentMessage(msg.desc);
	
	this.inquiryView.empty();
	this.interactionView.empty();
	$('.container-fluid').empty();
	
	this.addInquiries(msg.inquiries, msg.id);
	
	switch (msg.type) {
	case 'char':
		this.addInteraction(msg.id);
		break;
	case 'vender':
		this.addGoods(msg.goods, msg.id);
		break;
	case 'master':
		this.addLessons(msg.lessons, msg.id);
		break;
	}
	
	this.loadingPanel.hide();
	this.interactionPanel.show();
}

InteractionPanel.prototype.setTitle = function(title) {
	if (!title)
		title = "";
	
	this.titleView.html(exchange_color(title));
}

InteractionPanel.prototype.setContentMessage = function(msg) {
	if (!msg)
		msg = "";
	this.contentView.html(exchange_color(msg));
}

InteractionPanel.prototype.addInquiries = function(inquiries, id) {
	if (inquiries) {
		this.inquiryView.append('<span id="about">询问关于</span>');
		for (var k in inquiries) {
			this.inquiryView.append('<button class="btn btn-info btn-sm" about="' + k + '" who="' + id + '">' + inquiries[k] + '</button>');
		}
	}
	else {
		$('#inquiries').css('display','none');
	}
	
	var socket = this.socket;
	$('.btn-info').on('click', function() {
		$('#objModal').modal('hide');
		var target = $(this).attr('who'),
			about = $(this).attr('about');
		socket.emit('cmd', {
				cmd : 'inquiry',
				arg : {
					target : target,
					about : about
					}
				});
	});
}

InteractionPanel.prototype.addGoods = function(goods, id) {
	for (var good in goods) {
		$('.container-fluid').append('<div class="row"><div class="col-xs-3" path="' + good + '">' + exchange_color(goods[good].name) + '</div><div class="col-xs-3">价格</div><div class="col-xs-3 buy">购买</div></div>');
	}
	var socket = this.socket;
	$('.buy').on('click', function() {
		var $me = $(this);
		socket.emit('cmd',
			{
				cmd : 'buy',
				arg : {
					vender : id,
					item : $me.attr('path')
				}
			});
	});

}

InteractionPanel.prototype.addLessons = function(lessons, id) {
	for (var l in lessons) {
		
	}
}

InteractionPanel.prototype.addInteraction = function(id) {
	this.interactionView.append('<button class="btn btn-danger btn-sm" type="fight" target="' + id + '">切磋</button>')
				.append('<button class="btn btn-danger btn-sm" type="kill" target="' + id + '">杀!!</button>');

	var socket = this.socket;
	$('.btn-danger').on('click', function(){
		$('#objModal').modal('hide');
		var type = $(this).attr('type'),
			target = $(this).attr('target');
		switch (type) {
		case 'fight':
		case 'kill':
			socket.emit('cmd', {cmd:type, arg : target});
			break;
		}
	});
}

InteractionPanel.prototype.showLoading = function() {
	this.interactionPanel.hide();
	this.loadingPanel.show();
	this.view.modal('show');
}

InteractionPanel.prototype.show = function() {
	this.interactionView.show();
	this.loadingView.hide();
	this.view.modal('show');
}