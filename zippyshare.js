// ==UserScript==
// @name         ZippyShare
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*.zippyshare.com/v/*/file.html
// @grant        none
// ==/UserScript==

// Purpose : Trigger Download Button and avoid ads

(function() {
    'use strict';
    var dl = document.getElementById('dlbutton');
    dl = dl.getAttribute('href');
    location.replace(dl); // start download
})();