// ==UserScript==
// @name         wnacgDownload
// @namespace    yrWnacg
// @version      1.0
// @description  try to take over the world!
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @author       Yanagiragi
// @match        https://www.wnacg.org/photos-index-aid-*.html
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let btn = $('.downloadbtn')[0];


    let title = $('#bodywrap h2')[0].innerHTML;
    btn.download = encodeURIComponent(`${title}.zip`);

    $.ajax(btn.href).done(function( data ) {
        var el = $( '<div></div>' );
        el.html(data);
        let link = $('.down_btn', el)[0].href
        btn.href = link
    });

})();