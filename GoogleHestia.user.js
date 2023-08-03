// ==UserScript==
// @name        googleHestia
// @namespace   Yr
// @include     https://www.google.com/*
// @require     https://code.jquery.com/jquery-3.3.1.slim.min.js
// @version     1.1
// @grant       none
// ==/UserScript==
(function () {
    $('#body center').css('display', 'none')
    $('#body').append('<center> <img src="https://i.imgur.com/QNV3ma8.png" style="margin-top: 100px"> </center>')
})();
