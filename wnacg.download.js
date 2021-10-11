// ==UserScript==
// @name         wnacgDownload
// @namespace    yrWnacg
// @version      2.6
// @description  Enhanced download of wnacg
// @author       Toudaimori
// @match        http*://*.wnacg.com/photos-index-page-*.html
// @match        http*://*.wnacg.org/photos-index-page-*.html
// @match        http*://*.wnacg.com/photos-index-aid-*.html
// @match        http*://*.wnacg.org/photos-index-aid-*.html
// ==/UserScript==

'use strict';

async function FetchTarget()
{
    const resp = await fetch(location.href);
    const result = await resp.text();
    const match = result.match(/href=\"(\/download-index-aid-.*)"/);
    return 'http://wnacg.org' + match[1];
}

async function ParseDownloadLink(target)
{
    const resp = await fetch(target);
    const result = await resp.text();
    const matches = result.match(/a class="down_btn" href="\/\/(.*)"/);
    const rawLink = 'http://' + matches[1];
    return new URL(rawLink).href;
}

async function Run()
{
    const target = await FetchTarget();
    const link = await ParseDownloadLink(target);
    console.log(link); // for debug!
    const element = `<a class="btn" style="width:130px;" target="_blank" rel="noreferrer noopener" href=${link}>直接下載</a>`;
    const root = document.querySelector('.asTBcell.uwthumb');
    root.insertAdjacentHTML('beforeend', element);
}

Run();