// ==UserScript==
// @name         Transit Yahoo japan Enhanced
// @namespace    Yr
// @version      1.4
// @description  Add clipboard feature to simple copy infos of current page
// @author       yanagiragi
// @match        https://transit.yahoo.co.jp/search/result*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.co.jp
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';
    Mount();
})();

function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function Mount () {
    const summaries = [...document.querySelectorAll('.routeSummary .option ul')]
    const buttonHtml = `
<li class="print yrTransitBtn">
   <p class="btnDefault" style="width:35px">
   <a href="#">
    <span class="icnShare"></span>
   </a>
   </p>
</li>`
    summaries.forEach(x => {
        x.insertAdjacentHTML('beforeend', buttonHtml)
        const btn = x.querySelector('.yrTransitBtn')
        btn.addEventListener('click', async (event) => {
            event.stopPropagation()
            const title = document.querySelector('.title').textContent.replace('→', ' → ')
            const time = x.parentElement.parentElement.querySelector('.time').textContent
            const startTime = time.substring(0, time.indexOf('発'))
            const endTime = time.substring(time.indexOf('→') + 1, time.indexOf('着'))
            let shortUrl = x.parentElement.querySelector('.shortUrl').value
            if (!shortUrl) {
                const shareButton = x.parentElement.querySelector('.shareButton')
                shareButton.click()
                while (!shortUrl) {
                    shortUrl = x.parentElement.querySelector('.shortUrl').value
                    await sleep(500)
                }
            }
            console.log(`shortUrl = ${shortUrl}`)
            const firstTransit = [...x.parentElement.parentElement.parentElement.querySelectorAll('.transport')]
                ?.filter(x => !x.textContent.includes('徒歩'))
                ?.[0]
                ?.textContent
                ?.replace('当駅始発', ' ')
                ?.replace('※巡回ルート', ' ')
                .trim()
            const content = `${startTime} ~ ${endTime}: ${title} via [${firstTransit}](${shortUrl})`
            GM_setClipboard(content)
            console.log(`Copied: ${content}`)
        })
    })
}
