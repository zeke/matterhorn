Matterhorn
==========

A Google Chrome wordnik experiment.

Manual Install
--------------

1. Bring up the extensions management page by clicking the wrench icon and choosing Tools > Extensions.
2. If Developer mode has a + by it, click the + to add developer information to the page. The + changes to a -, and more buttons and information appear.
3. Click the Load unpacked extension button. A file dialog appears.
4. In the file dialog, navigate to your extension's folder and click OK.

References
----------

* http://code.google.com/chrome/extensions/getstarted.html
* If your extension needs to interact with web pages, then it needs a content script. 
	A content script is some JavaScript that executes in the context of a page that's 
	been loaded into the browser. Think of a content script as part of that loaded 
	page, not as part of the extension it was packaged with (its parent extension).
* http://stackoverflow.com/questions/950087/include-javascript-file-inside-javascript-file
* http://code.google.com/chrome/extensions/samples.html

To Do
-----

* Improve proper-noun regex search
* Generate a list of dom structures for various partners (e.g. div#nyt-article-body p or whatevs)