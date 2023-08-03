// ==UserScript==
// @name         jiku-chu-products
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  make target=_blank of href great again
// @author       yanagiragi
// @match        https://www.jiku-chu.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let targets = $('.title a');

    for (let i = 0; i < targets.length; ++i) {
        let ele = targets[i];
        let click = ele.getAttribute('onclick');
        if (click) {
            let href = click.match(/\/products\/detail.php(\?)product_id=([0-9]*)/)[0];
            ele.setAttribute('href', href);
        }
    }
})();