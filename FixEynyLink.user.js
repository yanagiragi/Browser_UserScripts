// ==UserScript==
// @name         Fix Eyny Link
// @namespace    Yr
// @version      1.2
// @description  Fix Eyny Link
// @match        http://*.eyny.com/forum.php?mod=forumdisplay&fid=*
// @match        https://*.eyny.com/forum.php?mod=forumdisplay&fid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eyny.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const regex = /forum\.php\?mod=viewthread&tid=([0-9]*)&/
    const links = [...document.querySelectorAll('a.xst'), ...document.querySelectorAll('.ptn > a')]
    for (const link of links) {
        const href = link.href
        const match = href.match(regex)
        if (match) {
            link.href = `https://www21.eyny.com/thread-${match[1]}-1-BX4TQDHP.html`
            console.log(`Replace ${href} to ${link.href}`)
        }
    }
})();