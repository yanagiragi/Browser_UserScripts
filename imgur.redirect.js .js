// ==UserScript==
// @name         imgur.redirect.js 
// @namespace    yr
// @version      0.2
// @description  try to take over the world!
// @author       Yanagiragi
// @match        https://i.imgur.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var location = 'https://imgur.com/' + window.location.pathname;
    if(document.getElementsByTagName('img')[0].getAttribute('alt') != window.location)
        window.location = location;
})();