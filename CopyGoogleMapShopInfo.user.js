// ==UserScript==
// @name         Copy google map shop Info
// @namespace    Yr
// @version      1.0
// @description  Copy shop info to markdown format
// @author       yanagiragi
// @match        https://www.google.com/maps/place/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    Setup();
})();

function Setup() {
    const block = document.querySelector('.m6QErb.Pf6ghf.ecceSd.tLjsW')
    const btnHtml = `<div jstcache="745" class="etWJQ jym1ob kdfrQc bWQG4d" jsan="t-WC_3NrOh6j8,7.etWJQ,7.jym1ob,7.kdfrQc,7.bWQG4d">
    <div jstcache="121" style="display:none"></div><button
        jsaction="pane.placeActions.share;keydown:pane.placeActions.share" jstcache="124" aria-label=""
        data-value="分享"
        jslog="13534;track:click;metadata:WyIwYWhVS0V3ajQyTnlUbDlQOUFoWFdRUFVISFVwVEQwY1E4QmNJQ0NnQiJd;mutable:true"
        class="g88MCb S9kvJb btnCopy"
        jsan="7.g88MCb,0.jsaction,t-diObG01SZ98,7.S9kvJb,0.aria-label,0.data-value,0.jslog,t-AbjrQ4n89-4"><span
            jstcache="126" class="DVeyrd" jsan="7.DVeyrd"><span class="ehYgCe"></span><img alt="複製" aria-hidden="true"
                draggable="false" jstcache="127"
                src="https://fonts.gstatic.com/s/i/materialiconsoutlined/content_copy/v17/24px.svg" class="EgL07d"
                jsan="7.EgL07d,0.alt,8.src,0.aria-hidden,0.draggable"><span jstcache="128"
                style="display:none"></span></span>
        <div aria-hidden="true" jstcache="129" class="R8c4Qb fontBodySmall"
            jsan="7.R8c4Qb,7.fontBodySmall,0.aria-hidden">複製</div>
        <div jstcache="130" style="display:none"></div>
    </button><a jstcache="124" class="" style="display:none"></a>
</div>`
    block.insertAdjacentHTML('beforeend', btnHtml);

    const copyBtn = document.querySelector('.btnCopy')
    copyBtn.addEventListener('click', CopyInfo);
}

function CopyInfo(event) {
    event.stopPropagation();

    const title = document.querySelector('.bwoZTb').textContent.trim()
    const days = [...document.querySelectorAll('.ylH6lf')].map(x => x.textContent.trim())
    const times = [...document.querySelectorAll('.mxowUb')].map(x => x.textContent.trim())
    const data = {}
    for (let i = 0; i < times.length; ++i) {
        if (times[i] in data) {
            data[times[i]].push(days[i])
            data[times[i]].sort()
        }
        else {
            data[times[i]] = [days[i]]
        }
    }
    const timeString = Object.entries(data).map(ToOpenTimeString).join(', ')

    Copy(`[${title}](${location.href}): ${timeString}`)
    console.log(`Copied: [${title}](${location.href}): ${timeString}`);
}

function ToOpenTimeString(data) {
    const [key, value] = data
    if (value.length == 7) return key; // don't display Mon~Sun if they are have same open time
    return `${value}: ${key}`
}

function Copy(value) {
    const el = document.createElement('textarea');
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}