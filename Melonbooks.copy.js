// ==UserScript==
// @name         MelonBooks_Enhanced
// @namespace    yrMelonBooks
// @version      1.0
// @description  Add clipboard feature to simple copy infos of current page
// @author       Yanagiragi
// @match        https://www.melonbooks.co.jp/detail/detail.php?product_id=*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // https://stackoverflow.com/a/5877034
    if (window.top != window.self)  //-- Don't run on frames or iframes
        return

    let nodeDiv = document.createElement("div")
    nodeDiv.style['padding-bottom'] = '10px'

    let nodeBtn = document.createElement("button")
    nodeBtn.addEventListener('click', event => {
        let title = document.querySelector('.clearfix h1')
        let circle = document.querySelector('.clearfix .circle')

        if(title && circle)
            GM_setClipboard (`${circle.innerHTML} - ${title.innerHTML}\n${location.href}\n`)
    })

    let nodeText = document.createTextNode("Copy To Clipboard")
    document.getElementsByClassName('head')[0].prepend(nodeDiv)

    nodeDiv.appendChild(nodeBtn)
    nodeBtn.appendChild(nodeText)

})();