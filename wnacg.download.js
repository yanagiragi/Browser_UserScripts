// ==UserScript==
// @name         wnacgDownload
// @namespace    yrWnacg
// @version      1.2
// @description  Enhanced download of wnacg
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @author       Yanagiragi
// @match        https://www.wnacg.org/photos-index-aid-*.html
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';
    const title = $('#bodywrap h2').text();
    const btn = $('.downloadbtn');

    $.ajax(btn.attr('href')).done( data => {
        const link = $('.down_btn', $(data)).attr('href')
        btn.on('click', event => {
            event.preventDefault();
            GM_download(link, `${title}.zip`)
        })
    });

})();