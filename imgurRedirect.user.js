// ==UserScript==
// @name         imgur.redirect.js 
// @namespace    Yr
// @version      0.2
// @description  try to take over the world!
// @author       yanagiragi
// @match        https://i.imgur.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    var location = 'https://imgur.com/' + window.location.pathname;
    if (document.getElementsByTagName('img')[0].getAttribute('alt') != window.location)
        window.location = location;
})();