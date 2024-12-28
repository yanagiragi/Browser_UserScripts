// ==UserScript==
// @name         OpenTwitterPixivLinks
// @namespace    Yr
// @version      1.3
// @description  Open all twitter or pixiv image links in new tab in gmail
// @author       yanagiragi
// @match        https://mail.google.com/mail/u/0/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

function openTwitterLinks () {
    const content = document.querySelector('.ii.gt').textContent
    const matches = content.match(/(pbs\.twimg\.com\/media\/.*\.jpg:orig)/g)
    const set = [...new Set(matches)]
    set.forEach(el => {
        console.log(`open ${el}`)
        window.open(`https://${el}`, '_blank')
    })
}

function openPixivLinks () {
    const content = document.querySelector('.ii.gt').textContent
    const matches = content.match(/www\.pixiv\.net\/artworks\/\d+/g)
    const set = [...new Set(matches)]
    set.forEach(el => {
        console.log(`open ${el}`)
        window.open(`https://${el}`, '_blank')
    })
}

function click () {
    console.log('click')
    openTwitterLinks()
    openPixivLinks()
}

function mount () {
    const bar = [...document.querySelectorAll('.G-atb')]
        .filter(x => x.style['display'] != 'none')
        ?.[0]
    if (bar.querySelector('.YrOpenTwtterButuon')) {
        // already mounted
        return;
    }
    bar.insertAdjacentHTML('beforeend', `<div class="YrOpenTwtterButuon" class="asa"><div class="ar8 T-I-J3 J-J5-Ji"></div></div>`)

    const button = bar.querySelector('.YrOpenTwtterButuon')
    button.addEventListener('click', click)

    console.log(`mount on ${button}`)
}

(function () {
    'use strict';
    const mailRegex = /mail\.google\.com\/mail\/u\/0\/(.*)/
    let interval = setInterval(() => {
        // only mount button in mail detail page
        if (!location.href.match(mailRegex)) {
            return;
        }

        // wait for bar shows up
        if (document.querySelector('.asa')) {
            mount()
        }
    }, 1000)
})();