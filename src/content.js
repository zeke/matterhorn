console.log('Matterhorn. Toot toot.');

// Process body paragraphs
// $('div.ec-blog-body p').each(function() {
$('div.ec-blog-body p').each(function() {
	var old_html = $(this).html();
	var new_html = old_html.
		replace(/ on /, " <a href='http://wordnik.com/words/on'>on</a> ").
		replace(/ the /, " <a href='http://wordnik.com/words/the'>the</a> ");
   $(this).html(new_html);
});

// Capture mouseup events
window.addEventListener("mouseup", function(b) {
	console.log(window.getSelection().toString());	
});