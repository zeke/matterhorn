console.log('Matterhorn2');

function injectJs(link) {
	var scr = document.createElement("script");
	scr.type="text/javascript";
	scr.src=link;
	(document.head || document.body || document.documentElement).appendChild(scr);
}

// Gotta override the old-school jQuery on economist.com with this,
// otherwise we get weirdo JS errors..
injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js');
// injectJs("http://schifani.com/inject.js");
injectJs(chrome.extension.getURL("inject.js"));