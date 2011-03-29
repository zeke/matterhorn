console.log('Matterhorn. Toot toot.');

// Process all body paragraphs	
$('p').each(function() {
	var new_html = "";
	var old_html = $(this).html();
	
	// Break up paragraph into sentences, preserving the
	// punctuation at the end of each sentence
	var sentences = old_html.replace(/(\.|\?|\!])+ /g, "$1ENDOFSENTENCE").split("ENDOFSENTENCE");

	// Cycle through each sentence, replacing capitalized words and word groups.
	// (But not the first words in the sentences)
	for (var i in sentences) {
		new_html += sentences[i].replace(/ +([A-Z][a-z]*)([\s][A-Z][a-z]*)*/g, " <a href='http://wordnik.com/words/$1$2' style='color:red;'>$1$2</a>");
	}
		// replace(/ on /, " <a href='http://wordnik.com/words/on'>on</a> ").
		// replace(/ the /, " <a href='http://wordnik.com/words/the'>the</a> ");
   $(this).html(new_html);
});

// Capture mouseup events
window.addEventListener("mouseup", function(b) {
	console.log(window.getSelection().toString());	
});