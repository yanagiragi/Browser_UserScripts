// ==UserScript==
// @name         FanboxAutoOpenBlank
// @namespace    Yr
// @version      1.0
// @description  Auto open link in new tab, worked with FanboxAutoDownload
// @author       yanagiragi
// @match        https://*.fanbox.cc/
// @icon         https://www.google.com/s2/favicons?domain=fanbox.cc
// @grant        none
// ==/UserScript==

let links = [];
let interval;
const scrollCheckTimeout = 3;
const checkInterval = scrollCheckTimeout + 30;

(function () {
    'use strict';
    interval = setInterval(Update, 1000 * checkInterval);
    Update();
})();

function Cancel() { clearInterval(interval); }

function Update() {
    window.scrollTo(0, document.body.scrollHeight);

    // wait for ajax to work
    setTimeout(() => {
        CheckForLinks().forEach(x => {
            if (!links.includes(x)) {
                window.open(x, "_blank")
                links.push(x)
            }
        })
        links = [...new Set(links)]
    }, 1000 * scrollCheckTimeout)
}

function CheckForLinks() {
    return [...new Set([...document.querySelectorAll('.sc-11axwx2-0.bXrzaX a')].map(x => x.href))]
}