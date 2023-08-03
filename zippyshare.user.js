// ==UserScript==
// @name        ZippyShare
// @namespace   Yr
// @include     http://*.zippyshare.com/v/*/file.html
// @include     https://*.zippyshare.com/v/*/file.html
// @version     1
// @grant       none
// ==/UserScript==
// if error occurs with closing windows, try config firefox by accessing about:config
var set;

(function () {
    'use strict';
    var dl = document.getElementById('dlbutton');
    dl = dl.getAttribute('href');
    location.replace(dl); // start download
    set = setInterval(closeWindows, 1000 * 3);
})();

function closeWindows() {
    window.close();
    clearInterval(set);
}
