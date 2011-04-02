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

	activate: function() {
    $('p').addClass('meat_mode');
	},
	
	hide: function() {
    $('p').removeClass('meat_mode');
	}

};

var Overlay = {
	active: false,
	term: null,
	term_element: null,
	margin_left: 20,
	nav_item_names: ['Content', 'Word', 'Community'],
	
	init: function() {
		
		// Define overlay styles
		var styles = [
			"#wordnik_overlay { position:absolute; width:300px; background:yellow; display:none; z-index:101; }",
			"#wordnik_overlay { padding:5px; background:#FFF; border:2px solid #666; min-height:20px}",
			"#wordnik_overlay { -moz-box-shadow: #CCCCCC 0 2px 5px 3px; -webkit-box-shadow: #CCCCCC 0 2px 5px 3px; -o-box-shadow: #CCCCCC 0 2px 5px 3px; box-shadow: #CCCCCC 0 2px 5px 3px; }",
			"#wordnik_overlay { -moz-border-radius: 4px; -webkit-border-radius: 4px; -o-border-radius: 4px; -ms-border-radius: 4px; -khtml-border-radius: 4px; border-radius: 4px; }",
			"#wordnik_overlay h1 { font-size:1.6em; margin:0; padding:0; text-align:center; }",
			"#wordnik_overlay div.throbber { position:absolute; top:5px; right:10px; width:16px; height:16px; background:transparent url(http://schifani.com/throbber.gif) no-repeat; }",
			"#wordnik_overlay ul.nav { float:none; clear:both; overflow:hidden; margin:10px 0 0 0; padding:0; list-style:none; border-bottom:1px solid #999; }",
			"#wordnik_overlay ul.nav li { float:left; margin: 0 2px 0 0; }",
			"#wordnik_overlay ul.nav li a { display:block; color:#666; background-color:#EEE; padding:4px 0; width:96px; text-decoration:none; text-align:center; }",			
			"#wordnik_overlay ul.nav li a { webkit-border-top-left-radius: 4px; -webkit-border-top-right-radius: 4px; -moz-border-radius-topleft: 4px; -moz-border-radius-topright: 4px; border-top-left-radius: 4px; border-top-right-radius: 4px; }",
			"#wordnik_overlay ul.nav li a:hover, #wordnik_overlay ul.nav li a.active { color:white; background-color:#FE6E30 }",
			"#wordnik_overlay div.section { margin:10px 0; }",
			"#wordnik_overlay div.section.content { margin:0; }",
			"#wordnik_overlay div.section.community { margin:10px 0 0 5px; font-size:1.2em; color:#999; }",
			"#wordnik_overlay ul.definitions { margin:0; padding:0; list-style:none; }",
			"#wordnik_overlay ul.definitions li { font-size:1em; color:#666; margin:0; padding:5px 3px; border-bottom:1px solid #DDD; line-height: 1.3em; }",
			"#wordnik_overlay ul.definitions li:last-child { border-bottom:none; }",
			"#wordnik_overlay a.powered_by_wordnik { display:block; padding:10px 0 0 5px; }"
		];
		css = "<style type='text/css'>" + styles.join(" ") + "</style>";
		$(css).appendTo("head");

		// Create a container for the overlay
		$('body').append('<div id="wordnik_overlay"></div>');
		
		// This method is called when highlighter terms are clicked
		// jQuery's live method is used because the #wordnik_overlay DOM element is created post-document-load
	  $("#wordnik_overlay").live("activate", function(event, something) {
			log('activate #wordnik_overlay');
		
			// Request content
			var url = "http://api.wordnik.com/v4/word.json/" + Overlay.term + "/definitions?useCanonical=true&api_key=" + Config.api_key + "&callback=?";
			log(url);
			$.getJSON(url, function(response) {
				log(response);
				Overlay.updateContent(response);
			});
			
			// Show thobber in the absence of content..
			$(this).html('<div class="throbber"></div>');
			
			Overlay.updateScale();
		
			// Keep this event from bubbling;
			// event.preventDefault();
			// return false;
	  });
	},
	
	// Save current element and term,
	// then trigger the overlay's live 'activate' method..
	activate: function(term_element) {
		Overlay.term = $(term_element).text();
		log("Overlay.activate for term: " + Overlay.term);
		Overlay.term_element = term_element;
		$("#wordnik_overlay").trigger("activate");
	},
	
	updateContent: function(response) {
		
		// Fade out the throbber, then show the other content..
		$('#wordnik_overlay .throbber').fadeTo('fast', 0, function(){
			
			// Title
	    $('#wordnik_overlay').append('<h1>' + Overlay.term + '</h1>');
	
			// Nav
			var nav_items = [];
			for (i in Overlay.nav_item_names) {
			 	var item_name = Overlay.nav_item_names[i];
			
				css_classes = [item_name.toLowerCase()];
				if (i == 0) css_classes.push('active');
				
				nav_items.push('<li><a href="#" class="' + css_classes.join(' ') + '" onclick="Overlay.showSection(\'' + item_name.toLowerCase() + '\'); return false;">' + item_name + '</a></li>');
			}			
			$('#wordnik_overlay').append('<ul class="nav">' + nav_items.join(' ') + '</ul>');
			
			// section: content
			$('#wordnik_overlay').append('<div class="section content"><img src="http://schifani.com/map.png"></div>');
			
			// section: word
			var items = [];
			for (i in response) {
				var def = response[i];
				items.push('<li>' + def.text + '</li>');
			}
			$('#wordnik_overlay').append('<div class="section word" style="display:none"><ul class="definitions">' + items.join(' ') + '</ul></div>');
			
			// section: community
			$('#wordnik_overlay').append('<div class="section community" style="display:none">Community (soon)</div>');
			
			// Powered by wordnik
	    $('#wordnik_overlay').append('<a href="http://wordnik.com" class="powered_by_wordnik"><img src="http://schifani.com/powered_by_wordnik.png"></a>');
			
		});
		
		Overlay.updateScale();
	},
	
	// Hide all sections, then show the current one
	showSection: function(section) {
		$('div.section').hide();
		$('div.section.'+section).show();
		
		$('ul.nav a').removeClass('active');
		$('ul.nav a.'+section).addClass('active');
	},
	
	updateScale: function() {
		var te = Overlay.term_element;
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
			"#toggle_entities { position:fixed; top:50px; right:10px; font-size:1.2em; width:28px; height:28px; background:transparent url(http://schifani.com/info.png) no-repeat; text-indent:-10000px; }",
			"#toggle_meat { position:fixed; top:83px; right:10px; font-size:1.2em; width:28px; height:46px; background:transparent url(http://schifani.com/skim.png) no-repeat; text-indent:-10000px; }"
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
				new_html += sentences[i].replace(/ +([A-Z][a-zA-Z]*)([\s][A-Z][a-zA-Z]*)*/g, " <a href=\"#\" onclick=\"Overlay.activate($(this));return false;\" class=\"entity\">$1$2</a>");
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
		log('Entities.activate()');
		$('p').each(function() {
			log($(this).data('new_html'));
			$(this).html($(this).data('new_html'));
		});
		Entities.active = true;
	},
	
	deactivate: function() {
		log('Entities.deactivate()');
		$('p').each(function() {
			log($(this).data('old_html'));
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

// Capture mouseup events. Log if selected text is present and longer than 1 character
window.addEventListener("mouseup", function(b) {
	var selection = window.getSelection().toString();
	if (selection.length > 1) {
		log(selection);
	}
});

var Matterhorn = {
	init: function() {
		Entities.init();
		MeatAndPotatoes.init();
		Overlay.init();
		Nav.init();
		
		Entities.activate();
	}
};

setTimeout("Matterhorn.init()", 5000);