$(document).ready(function() {

	/* This is basic - uses default settings */
	
	$("a#single_image").fancybox();
	$("a#single_image1").fancybox();
	$("a#single_image2").fancybox();
	
	/* Using custom settings */
	
	$("a#inline").fancybox({
		'hideOnContentClick': true
	});

	/* Apply fancybox to multiple items */
	
	$("a.grouped_elements").fancybox({
		'transitionIn'	:	'elastic',
		'transitionOut'	:	'elastic',
		'speedIn'		:	600, 
		'speedOut'		:	200, 
		'overlayShow'	:	true
	});
	
});