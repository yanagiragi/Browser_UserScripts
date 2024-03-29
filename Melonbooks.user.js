// ==UserScript==
// @name         MelonBooks_Enhanced
// @namespace    Yr
// @version      2.1
// @description  Add clipboard feature to simple copy infos of current page
// @author       yanagiragi
// @match        https://www.melonbooks.co.jp/detail/detail.php?product_id=*
// @grant        GM_setClipboard
// ==/UserScript==

function CreateBtn () {
    const btn = document.createElement("button")
    btn.style['padding'] = '5px'
    btn.style['margin'] = '5px'
    return btn
}

(function () {
    'use strict';

    // https://stackoverflow.com/a/5877034
    if (window.top != window.self)  //-- Don't run on frames or iframes
        return

    const title = document.querySelector('.page-header')
    const circle = document.querySelector('.author-name a')

    const mainDiv = document.createElement("div")
    mainDiv.style['padding-bottom'] = '10px'
    document.getElementsByClassName('item-header')[0].prepend(mainDiv)

    // setup copy to clipboard
    const copyBtn = CreateBtn()
    copyBtn.addEventListener('click', event => {
        if (title && circle)
            GM_setClipboard(`${circle.innerHTML} - ${title.innerHTML}\n${location.href}\n`)
    })

    const copyText = document.createTextNode("Copy To Clipboard")
    mainDiv.appendChild(copyBtn)
    copyBtn.appendChild(copyText)

    // setup Toranoana
    const toranoanaLink = document.createElement("a")
    const toranoanaBtn = CreateBtn()
    toranoanaBtn.addEventListener('click', event => {
        if (title) {
            const toranoanaUrl = `https://ec.toranoana.jp/tora_r/ec/app/catalog/list/?searchWord=${title.innerHTML}&searchBackorderFlg=0&searchUsedItemFlg=1&searchDisplay=0&detailSearch=true`
            const win = window.open(toranoanaUrl, '_blank');
            win.focus();
        }
    })
    const toranoanaText = document.createTextNode("Search in Toranoana")
    mainDiv.appendChild(toranoanaBtn)
    toranoanaBtn.appendChild(toranoanaText)

    // setup Mandarake
    const manadarakeLink = document.createElement("a")
    const manadarakeBtn = CreateBtn()
    manadarakeBtn.addEventListener('click', event => {
        if (title) {
            const manadarakeUrl = `https://order.mandarake.co.jp/order/listPage/list?keyword=${title.innerHTML}`
            const win = window.open(manadarakeUrl, '_blank');
            win.focus();
        }
    })
    const manadarakeText = document.createTextNode("Search in Manadarake")
    mainDiv.appendChild(manadarakeBtn)
    manadarakeBtn.appendChild(manadarakeText)
})();