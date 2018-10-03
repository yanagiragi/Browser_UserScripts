// ==UserScript==
// @name        MediaFire
// @namespace   yanagiragi
// @include     http://www.mediafire.com/file/*
// @include     https://www.mediafire.com/file/*
// @version     1
// @grant       none
// ==/UserScript==
// if error occurs with closing windows, try config firefox by accessing about:config
var set;

(function() {
    'use strict';
    var dl = document.querySelector('.download_link a');
    dl = dl.getAttribute('href');
    location.replace(dl); // start download
    set = setInterval(closeWindows, 1000 * 3);
})();

function closeWindows(){
    window.close();
    clearInterval(set);

}