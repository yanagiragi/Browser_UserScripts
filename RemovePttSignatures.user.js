// ==UserScript==
// @name         RemovePttSignatures
// @namespace    Yr
// @version      1.1
// @description  Remove annoying signatures in ptt
// @author       Yr
// @match        https://www.ptt.cc/bbs/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ptt.cc
// @grant        none
// ==/UserScript==


let intervalId
let removeNodes = []
let isVerbose = false // dev debug flag

function FindSpecificElement (node, notMatchCallback = _ => { }) {
    // find '--' element
    while (node) {
        node = node.previousSibling;
        if (node && node.textContent.trim().includes('--')) {
            break
        }
        notMatchCallback(node)
    }

    return node
}

function toggle () {
    for (const node of removeNodes) {
        if (node.style) {
            if (node.style.display != 'none') {
                node.style.display = 'none'
            }
            else {
                node.style.display = ''

                // special deal lazy loaded images
                for (const child of node.childNodes) {
                    if (child.style && child.style.width == '0px') {
                        child.style.width = ''
                    }
                }
            }
        }
    }
}

function log (msg) {
    if (isVerbose) {
        console.log(msg)
    }
}

function Run () {
    log('checking ...')

    let identifer = [...document.querySelectorAll('span.f2')][0]

    // find end '--' element
    identifer = FindSpecificElement(identifer)
    log(`end = `);
    log(identifer);

    // find start '--' element
    identifer = FindSpecificElement(identifer, e => removeNodes.push(e))
    log(`start = `);
    log(identifer);

    // identifer is null if two '--' exists (a.k.a. signature exists)
    if (identifer) {
        // console.log(removeNodes)
        toggle()
        identifer.textContent += '\n<Signatures removed by userscript>\n'
    }

    clearInterval(intervalId)
    log('Done, Clear interval.')

    if (identifer) {
        const mainDiv = document.querySelector('#main-content')
        mainDiv.insertAdjacentHTML('beforebegin', `<div><button id="yrShowSignatures" style="position: fixed; z-index: 1; right: 5px;"> Show/Hide Signatures </button></div>`);

        const btn = document.querySelector('#yrShowSignatures')
        btn.addEventListener('click', toggle)
    }
}

intervalId = setInterval(Run, 1000 * 0.5)