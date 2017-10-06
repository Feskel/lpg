jq_144(document).ready(function($) {
	$('input[type=radio]').each(function() {
		if($(this).parent().hasClass('form-list-item') && $(this).attr('name').substr(0, 7) == 'widget_') {
			$(this).parent().contents().filter(function () {
				return this.nodeType === 3;
			}).wrap('<sublabel></sublabel>');
		}
	});
	$('sublabel').each(function() {
		$(this).css('cursor', 'default');
	});
	$('sublabel').on('click', function() {
		$(this).prev().click();
	});
});