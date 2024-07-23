// ==UserScript==
// @name         Spotify Copy Title
// @namespace    Yr
// @version      1.0
// @description  Copy song title without login
// @author       yanagiragi
// @match        https://open.spotify.com/track/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant        GM_setClipboard
// ==/UserScript==

function Check() {
    const div = document.querySelector('.RP2rRchy4i8TIp1CTmb7 span')
    return div
}

function Mount() {
    const div = document.querySelector('.RP2rRchy4i8TIp1CTmb7 span')
    const html = `<a href="#" id="YrCopyBtn" style="margin: 10px;">Copy Title</a>`
    div.insertAdjacentHTML('beforeend', html)
    const btn = document.querySelector('#YrCopyBtn')
    btn.addEventListener('click', event => {
        const title = document.querySelector('.rEN7ncpaUeSGL9z0NGQR')
        const author = document.querySelector('a[data-testid="creator-link"]')
        const content = `${author.textContent}-${title.textContent}`
        GM_setClipboard(content)

        btn.textContent = `Copied: ${content}!`
        setTimeout(() => {
            btn.textContent = 'Copy Title'
        }, 500)
    })
}

(function() {
    'use strict';
    var interval = setInterval(() => {
        if (Check()) {
            Mount()
            clearInterval(interval)
        }
    }, 500)
})();
