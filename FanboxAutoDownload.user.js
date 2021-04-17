// ==UserScript==
// @name         FanboxAutoDownload
// @namespace    Yr
// @version      1.1
// @description  Download all pictures in pixiv fanbox
// @author       Toudaimori
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js
// @match        https://*.fanbox.cc/posts/*
// @grant 	     GM_download
// @grant        GM.xmlHttpRequest
// ==/UserScript==

function getImageBase64(index, path)
{
    return new Promise((resolve, reject) => {
        const extension = path.substring(path.lastIndexOf('.') + 1)
        GM.xmlHttpRequest({
            method: "GET",
            url: path,
            overrideMimeType: 'text/plain; charset=x-user-defined',
            onload: response => {
                let binary = "";
                const responseText = response.responseText;
                const responseTextLen = responseText.length;
                for ( let i = 0; i < responseTextLen; i++ ) {
                    binary += String.fromCharCode(responseText.charCodeAt(i) & 255)
                }

                // Note there is no 'data:image/jpeg;base64,' Due to JSZip
                let src = btoa(binary)

                console.log(`Downloaded: ${index}.${extension}, src=${path}`)
                resolve({'index': index, 'base64': src, 'extension': extension })
            }
        })
    })
}

async function Compress(title, pics)
{
    console.log(`Start Compress`)
    const zip = new JSZip();
    const folder = zip.folder(title);
    for(let i = 0; i < pics.length; ++i){
        folder.file(`${pics[i].index}.${pics[i].extension}`, pics[i].base64, {base64: true})
    }
    const content = await zip.generateAsync({type:"blob", streamFiles: true}, metadata => {
        console.log(`Compress Progress = ${metadata.percent} %`)
    })
    console.log(`All Done, Save to ${title}.zip`);
    return saveAs(content, `${title}.zip`);
}

async function downloadWrapper(metaData)
{
    const [title, img] = metaData
    const tasks = img.map(async (x, idx) => getImageBase64(idx, x) )
    const result = await Promise.all(tasks)
    console.log(result)
    return await Compress(title, result)
}

async function Run(callback)
{
    window.scrollTo(0,document.body.scrollHeight);
    const title = document.querySelector('.sc-1vjtieq-8').textContent
    const imgs = [...document.querySelectorAll('.gcZCGE')].map(x => x.href)
    const metaData = [title, imgs]
    await downloadWrapper(metaData)
    console.log('Done')
    setTimeout(window.close, 1000 * 3)
}

(function() {
    'use strict';
    setTimeout(Run, 1000 * 5)
})();
