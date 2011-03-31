console.log('Matterhorn. Toot toot.');

$(function() {
	
	$('body').data('overlay', {
		show: function(term) {
			console.log('term: ' + term);
		}
	});
	
	// Process all body paragraphs
	$('p').each(function() {
		var old_html = $(this).html();
		var new_html = "";
		
		// Break up paragraph into sentences, preserving the
		// punctuation at the end of each sentence
		var sentences = old_html.replace(/(\.|\?|\!])+ /g, "$1END_OF_SENTENCE").split("END_OF_SENTENCE");

		// Cycle through each sentence, replacing capitalized words and word groups.
		// (But not the first words in the sentences)
		for (var i in sentences) {
			new_html += sentences[i].replace(/ +([A-Z][a-z]*)([\s][A-Z][a-z]*)*/g, " <a href=\"#\" onclick=\"$('body').data('overlay').show('$1$2');return false;\" style=\"color:red;\">$1$2</a>");
		}

		$(this).html(new_html);
	});
	
});

// $.getScript("my_lovely_script.js", function(){
//    alert("Script loaded and executed.");
// });

// Capture mouseup events
window.addEventListener("mouseup", function(b) {
	console.log(window.getSelection().toString());
});