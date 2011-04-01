console.log('Matterhorn. Toot toot.');

var MeatAndPotatoes = {

	init: function() {
		
		var styles = [
			"p.meat_mode { color:#999; }",
			"p.meat_mode a { color:#999; }",
			"p.meat_mode span.meat { color:#000; background-color: #F3F095 }",
			"p.meat_mode span.meat a { color:#000; }"
		];			
		css = "<style type='text/css'>" + styles.join(" ") + "</style>";
		$(css).appendTo("head");
		
	},
	
	toggle: function() {
    $('p').toggleClass('meat_mode');
	},

	show: function() {
    $('p').addClass('meat_mode');
	},
	
	hide: function() {
    $('p').removeClass('meat_mode');
	}

};

var Overlay = {
	active: false,
	margin_left: 20,
	init: function() {
		
		// Define styles
		var styles = [
			"#wordnik_overlay { position:absolute; width:300px; background:yellow; display:none; z-index:101; }",
			"#wordnik_overlay { padding:5px; background:#FFF; border:2px solid #666; min-height:20px}",
			"#wordnik_overlay { -moz-box-shadow: #CCCCCC 0 2px 5px 3px; -webkit-box-shadow: #CCCCCC 0 2px 5px 3px; -o-box-shadow: #CCCCCC 0 2px 5px 3px; box-shadow: #CCCCCC 0 2px 5px 3px; }",
			"#wordnik_overlay { -moz-border-radius: 4px; -webkit-border-radius: 4px; -o-border-radius: 4px; -ms-border-radius: 4px; -khtml-border-radius: 4px; border-radius: 4px; }",
			"#wordnik_overlay h1 { font-size:1.3em; margin:0; padding:0; }",
			"#wordnik_overlay div.throbber { position:absolute; top:5px; right:10px; width:16px; height:16px; background:transparent url(throbber.gif) no-repeat; }",
			"#wordnik_overlay ul.definitions { margin:0; padding:0; list-style:none; }",
			"#wordnik_overlay ul.definitions li { font-size:0.8em; color:#666; margin:0; padding:5px 3px; border-bottom:1px solid #DDD; }",
			"#wordnik_overlay ul.definitions li:last-child { border-bottom:none; }"
		];
		
		css = "<style type='text/css'>" + styles.join(" ") + "</style>";
		$(css).appendTo("head");

		$('body').append('<div id="wordnik_overlay"></div>');
		
		// This method is called when highlighter terms are clicked
	  $("#wordnik_overlay").live("show", function(event, term_element) {

			// Save current element and term in the #wordnik_overlay DOM element's data
			var term = $(term_element).text();
			$(this).data('term_element', term_element);
			$(this).data('term', term);
		
			// Request content
			var url = "http://api.wordnik.com/v4/word.json/" + term + "/definitions?useCanonical=true&api_key=" + Config.api_key + "&callback=?";
			// log("url: " + url);
			$.getJSON(url, function(response) {
				Overlay.updateContent(response);
			});
			
			// Wipe out content
			$(this).html('<div class="throbber"></div>');
			
			Overlay.updateScale();
		
			// Keep this event from bubbling;
			// event.preventDefault();
			// return false;
	  });
	},
	
	show: function(term_element) {
		$("#wordnik_overlay").trigger("show", term_element);
	},
	
	updateContent: function(response) {
		// log(response);
		
		// Fade out the throbber..
		$('#wordnik_overlay .throbber').fadeTo('fast', 0, function(){
			
			// Update the title
	    $('#wordnik_overlay').append('<h1>' + $('#wordnik_overlay').data('term') + '</h1>');

			// Update definitions
			var items = [];
			for (i in response) {
				var def = response[i];
				items.push('<li>' + def.text + '</li>');
			}
			$('#wordnik_overlay').append('<ul class="definitions">' + items.join(' ') + '</ul>');
			
		});
		
		Overlay.updateScale();
		
	},
	
	updateScale: function() {
		var te = $('#wordnik_overlay').data('term_element');
		$('#wordnik_overlay').
			css({
				left: $(te).offset().left + $(te).outerWidth() + Overlay.margin_left,
				top: $(te).offset().top + $(te).outerHeight()/2 - $('#wordnik_overlay').outerHeight()/2
			}).
			fadeIn();
	},
	
	hide: function() {
		if (Overlay.active) {
			$("#wordnik_overlay").fadeOut();
		}
	}
	
};

var Nav = {
	
	init: function() {
		
		// Define styles
		var styles = [
			"#toggle_entities { position:fixed; top:10px; right:10px }",
			"#toggle_meat { position:fixed; top:40px; right:10px }"
		];			
		css = "<style type='text/css'>" + styles.join(" ") + "</style>";
		$(css).appendTo("head");

		// Add nav links to DOM
		$('body').append('<a href="#" onclick="Entities.toggle();return false;" id="toggle_entities">Toggle Entities</a>');
		$('body').append('<a href="#" onclick="MeatAndPotatoes.toggle();return false;" id="toggle_meat">Toggle Meat and Potatoes</a>');
	}
	
};

var Entities = {
	active: false,
	
	init: function() {
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
				new_html += sentences[i].replace(/ +([A-Z][a-zA-Z]*)([\s][A-Z][a-zA-Z]*)*/g, " <a href=\"#\" onclick=\"Overlay.show($(this));return false;\" class=\"entity\">$1$2</a>");
				new_html += " ";
			}
			
			// Save both the old and new versions of the paragraph's content
			$(this).data('old_html', old_html);
			$(this).data('new_html', new_html);
		});
	},
	
	toggle: function() {
		Entities.active ? Entities.deactivate() : Entities.activate();
	},
	
	activate: function() {
		$('p').each(function() {
			$(this).html($(this).data('new_html'));
		});
		Entities.active = true;
	},
	
	deactivate: function() {
		$('p').each(function() {
			$(this).html($(this).data('old_html'));
		});
		Entities.active = false;
	}
	
};

var Config = {
	api_key: "b39ee8d5f05d0f566a0080b4c310ceddf5dc5f7606a616f53"
};

// Logging function that accounts for browsers that don't have window.console
function log(m) {
	if (window.console) console.log(m);
}

$(function() {
	
	Entities.init();
	MeatAndPotatoes.init();
	Overlay.init();
	Nav.init();
		
	// TODO: Remove this. It's temporary.
	Entities.toggle();

});

// Capture mouseup events. Log if selected text is present and longer than 1 character
window.addEventListener("mouseup", function(b) {
	var selection = window.getSelection().toString();
	if (selection.length > 1) {
		console.log(selection);
	}
});
