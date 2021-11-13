// ==UserScript==
// @name         wnacgDownload
// @namespace    yrWnacg
// @version      2.9
// @description  Enhanced download of wnacg
// @author       Toudaimori
// @match        http*://*.wnacg.com/photos-index-page-*.html
// @match        http*://*.wnacg.org/photos-index-page-*.html
// @match        http*://*.wnacg.com/photos-index-aid-*.html
// @match        http*://*.wnacg.org/photos-index-aid-*.html
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// ==/UserScript==

'use strict';

// Global Defines
const waitingStr = `排隊中`;
const downloadStr = `已下載`;
const timeout = 1000; // time interval between retry
const successCountLimit = 3; // How many continous success checks required to start download, set 0 for instant download
const closeTabInterval = -1; // set to -1 to avoid auto close new opened tabs
const closeWindowInterval = -1; // set to -1 to avoid auto close current window

const protocol = location.protocol

// Modified from https://gist.github.com/WebReflection/df05641bd04954f6d366
// with predefined object specific, for HTML entities only
function _Unescape(s) {
  var re = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;
  var unescaped = {
    '&amp;': '&',
    '&#38;': '&',
    '&lt;': '<',
    '&#60;': '<',
    '&gt;': '>',
    '&#62;': '>',
    '&apos;': "'",
    '&#39;': "'",
    '&quot;': '"',
    '&#34;': '"',
     '-': '-'
  };
  return s.replace(re, function (m) {
    return escape(unescaped[m]);
  });
}

async function _Fetch(url)
{
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: { // Without header it return 200 and seldom return 503 even if service is not availiable
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/93.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
                "Upgrade-Insecure-Requests": "1",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            onload: function(response) {
                resolve(response.responseText)
            },
            onerror: function(error) {
                reject(error)
            }
        })
    })
}

async function FetchTarget()
{
    const result = await _Fetch(location.href);
    const match = result.match(/href=\"(\/download-index-aid-.*)"/);
    return `${protocol}//wnacg.org` + match[1];
}

async function ParseDownloadLink(target)
{
    const result = await _Fetch(target);
    const matches = result.match(/href="\/\/(.*wnacg\.download.*)"/);
    const rawLink = `${protocol}//` + _Unescape(matches[1]); // fixs download re-naming of server behaviour
    return new URL(rawLink).href;
}

function GetCategory()
{
    let raw = document.querySelector('.asTBcell.uwconn label').textContent
    raw = raw.replace(/分類：/, '').replace(/ /g, '').replace(/\//g,'')
    return encodeURIComponent(raw)
}

async function DisplayDownloading(event)
{
    const btn = document.querySelector('#YrDownloadBtn');
    const block = document.querySelector('#YrStatusBlock');
    const status = document.querySelector('#YrStatus');
    const retryCount = document.querySelector('#YrRetryCount');
    const lastRetry = document.querySelector('#YrLastRetry');
    const url = btn.href.replace(/&_ga=.*/, '') // remove ga since it sucks and broke server renaming function;

    let retries = 0;
    let successCount = 0;

    const Download = (onSuccessCallback, onFailCallback) => {
        // TODO: shoud refactor to call _Fetch later
        GM_xmlhttpRequest({
            method: "HEAD",
            url: url,
            headers: { // Without header it return 200 and seldom return 503 even if service is not availiable
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/93.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
                "Upgrade-Insecure-Requests": "1",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            timeout: 1000 * 10,
            onerror: function (error) {
                console.log('onerror')
                successCount = 0;
              onFailCallback();
            },
            onload: function (response) {
                console.log(`successCount = ${successCount}, code = ${response.status}`);
                if(response.status == 200) {
                    successCount += 1;
                    if (successCount >= successCountLimit) {
                        onSuccessCallback();
                    }
                    else {
                        onFailCallback();
                    }
                }
                else {
                    successCount = 0;
                    onFailCallback();
                }
            }
        });
    };

    const OnSuccess = () => {
        status.textContent = downloadStr;

        const openTab = async () => {

            console.log(url)
            // open download link in new tab, use it with set auto download to specific types
            const tab = await GM_openInTab(url);

            // auto close tab
            if (closeTabInterval > 0) {
                await new Promise((resolve) => setTimeout(resolve, closeTabInterval));
                tab.close();
            }

            // auto close window, use it with brower config: allow script to close window
            // e.g. Firefox: dom.allow_scripts_to_close_windows
            if (closeWindowInterval > 0) {
                setTimeout(() => window.close(), closeWindowInterval);
            }
        }

        openTab();
    }

    const OnFailed = () => {
        status.textContent = waitingStr;
        lastRetry.textContent = `${new Date().toLocaleTimeString()}`;
        retryCount.textContent = `${++retries}`;

        setTimeout(TryDownload, timeout);
    }

    const TryDownload = () => Download(OnSuccess, OnFailed);

    // btn.style.display = 'none';
    block.style.display = 'block';
    lastRetry.textContent = `${new Date().toLocaleTimeString()}`;
    retryCount.textContent = `${retries}`;
    status.textContent = waitingStr;

    TryDownload();
}

function ButtonCallback (event) {
    event.preventDefault(); // for debug
    DisplayDownloading(event);
}

async function Run()
{
    const category = GetCategory();
    const target = await FetchTarget();
    let link = await ParseDownloadLink(target);
    link = link.replace(/\?n=/, `?n=[${category}]`)
    console.log(link); // for debug!
    const btnElement = `<a id="YrDownloadBtn" class="btn" style="width:130px;" target="_blank" rel="noreferrer noopener" href=${link}>直接下載</a>`;
    const statusElement = `
    <div id="YrStatusBlock" style="display: none;">
      <div>重試次數: <span id="YrRetryCount"></span></div>
      <div style="padding-bottom: 3px;">目前狀態: <span id="YrStatus" style="color: blueviolet; font-weight: bold; font-size: 1.5em;"></span></div>
      <div>最後重試時間: <span id="YrLastRetry"></span></div>
    </div>`;
    const root = document.querySelector('.asTBcell.uwthumb');
    root.insertAdjacentHTML('beforeend', btnElement);
    root.insertAdjacentHTML('beforeend', statusElement);

    const btn = document.querySelector('#YrDownloadBtn');
    btn.addEventListener('click', ButtonCallback);
}

Run();