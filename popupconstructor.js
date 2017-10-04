function getBlockID() {
	var blockID, blockStr = [], excludeMaps = [], yandexStr = [], i = 0, j = 0;

	$('.preview-main-container > div').each(function() {
		blockID = $(this).attr('id');
		if(blockID.substr(0, 9) == 'block-new') {
			blockStr[i] = '#' + $(this).attr('id');
			i++;
		}
	});

	for(i = 0; i < blockStr.length; i++) {
		if($(blockStr[i] + ' > div').length > 0) {
			$(blockStr[i] + ' > div').each(function() {
				if(typeof $(this).attr('id') !== 'undefined') {
					blockID = $(this).attr('id');
					if(blockID.substr(blockID.length - 4, 4) == '_map' && blockID.substr(0, 3) == 'new') {
						excludeMaps[j] = '#' + $(this).parent().attr('id');
						j++;
					}
				}
			});
		}
	}

	for(i = 0; i < blockStr.length; i++) {
		for(j = 0; j < excludeMaps.length; j++) {
			if(blockStr[i] == excludeMaps[j]) blockStr.splice(i, 1);
		}
	}

	j = 0;

	for(i = 0; i < excludeMaps.length; i++) {
		if($(excludeMaps[i] + ' ymaps').length > 0) {
			yandexStr[j] = excludeMaps[i] + ' > div > ymaps';
			j++;
		}
	}

	return [blockStr, yandexStr];
}

function getScrollbarWidth() {
	var outer = document.createElement('div');
	outer.style.visibility = 'hidden';
	outer.style.width = '100px';
	document.body.appendChild(outer);

	var widthNoScroll = outer.offsetWidth;
	outer.style.overflow = 'scroll';

	var inner = document.createElement('div');
	inner.style.width = '100%';
	outer.appendChild(inner);

	var widthWithScroll = inner.offsetWidth;
	outer.parentNode.removeChild(outer);

	return widthNoScroll - widthWithScroll;
}

function ConstractPopup(cfg) {

	if (!(this instanceof ConstractPopup)) {
		return new ConstractPopup(cfg);
	}

	var that = this,
	ppElements = cfg.ppElements,
	ppCloseBtns = cfg.ppCloseBtns || '';

	this.$ppBg = $(cfg.ppBg);

	var ppWidth = this.$ppBg.width(),
	ppHeight = this.$ppBg.height(),
	topDif = parseInt(this.$ppBg.css('top')),
	leftDif = parseInt(this.$ppBg.css('left'));

	this.$ppBg.css({position: 'relative', top: '0', left: '0', display: 'block', padding: '0', overflow: 'hidden'});
	$(ppElements).each(function(index, element) {
		that.$ppBg.append(
			$(element).css({
				top: (parseInt($(element).css('top')) - topDif) + 'px',
				left: (parseInt($(element).css('left')) - leftDif) + 'px'
			})
		);
	});

	this.overlayClose = function () {
		that.$ppBg.dialog('close');
	};

	function popupPosition() {
		var topResize = ($(window).height() - ppHeight) / 2,
		leftResize = ($(window).width() - ppWidth) / 2;
		if(topResize < 0 && leftResize > 0) {
			$('.constract-popup').css({
				'overflow-y': 'scroll',
				'overflow-x': 'hidden',
				height: $(window).height(),
				width: ppWidth + getScrollbarWidth()
			});
			leftResize = ($(window).width() - ppWidth - getScrollbarWidth()) / 2;					
		}
		else if(topResize > 0 && leftResize < 0) {
			$('.constract-popup').css({
				'overflow-x': 'scroll',
				'overflow-y': 'hidden',
				height:  ppHeight + getScrollbarWidth(),
				width: $(window).width()
			});
			topResize = ($(window).height() - ppHeight - getScrollbarWidth()) / 2;
		}
		else if(topResize <= 0 && leftResize <= 0) {
			$('.constract-popup').css({
				'overflow-x': 'scroll',
				'overflow-y': 'scroll',
				height: $(window).height(),
				width: $(window).width()
			});
		}
		else {
			$('.constract-popup').css({
				'overflow-x': 'hidden',
				'overflow-y': 'hidden',
				height: ppHeight, 
				width: ppWidth
			});
		}
		$('.constract-popup').css({
			top: topResize > 0 ? topResize : 0,
			left: leftResize > 0 ? leftResize : 0
		});
	}

	this.$ppBg.dialog({
		autoOpen: false,
		width: ppWidth,
		height: ppHeight,
		modal: true,
		resizable: false,
		classes: { 'ui-dialog': 'constract-popup' },
		open: function(event, ui) {
			$('div.ui-widget-overlay').on('click', that.overlayClose);
			if($(window).height() < $('.container.preview-main-container').height()) {
				$('.container.preview-main-container').css('padding-right', getScrollbarWidth());
				$(getBlockID()[0].toString()).css({'left': -getScrollbarWidth(), 'width': 'calc(100% + '+ getScrollbarWidth() +'px)'});
				$('body').css('overflow', 'hidden');
			}
			$('.constract-popup .ui-widget-content').width(ppWidth);
			popupPosition();
			$(window).resize(popupPosition);
			$(getBlockID()[1].toString()).width(parseInt($('div.container.preview-main-container').css('min-width')) > $(window).width() ? parseInt($('div.container.preview-main-container').css('min-width')) + getScrollbarWidth() : $(window).width());
		},
		close: function(event, ui) {
			if(that.ppOnClose) that.ppOnClose();
			$('.container.preview-main-container').css('padding-right', 0);
			$(getBlockID()[0].toString()).css({'left': 0, 'width': '100%'});
			$('body').css('overflow', 'visible');
			$(getBlockID()[1].toString()).width(parseInt($('div.container.preview-main-container').css('min-width')) > $(window).width() ? parseInt($('div.container.preview-main-container').css('min-width')) + getScrollbarWidth() : $(window).width());
		}
	});

	$(ppCloseBtns).on('click', function(e) {
		e.preventDefault();
		that.$ppBg.dialog('close');
	});
}