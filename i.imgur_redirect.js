// ==UserScript==
// @name         i.imgur_redirect
// @namespace    yr
// @version      0.1
// @description  try to take over the world!
// @author       Yanagiragi
// @match        https://i.imgur.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var location = 'https://imgur.com/' + window.location.pathname;
    window.location = location;
})();