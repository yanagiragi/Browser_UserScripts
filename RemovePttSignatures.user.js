// ==UserScript==
// @name         RemovePttSignatures
// @namespace    Yr
// @version      1.0
// @description  Remove annoying signatures in ptt
// @author       Yr
// @match        https://www.ptt.cc/bbs/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ptt.cc
// @grant        none
// ==/UserScript==

function FindSpecificElement(node, notMatchCallback = _ => { }) {
    // find '--' element
    while (node) {
        node = node.previousSibling;
        if (node && node.textContent.trim().endsWith('--')) {
            break
        }
        notMatchCallback(node)
    }

    return node
}

let intervalId

function Run() {
    console.log('Start checking ...')

    let identifer = [...document.querySelectorAll('span.f2')][0]
    let removeNodes = []

    // find end '--' element
    identifer = FindSpecificElement(identifer)

    // find start '--' element
    identifer = FindSpecificElement(identifer, e => removeNodes.push(e))

    // identifer is null if two '--' exists (a.k.a. signature exists)
    if (identifer) {

        console.log(removeNodes)
        for (const node of removeNodes) {
            node.remove()
        }

        identifer.textContent += '\n<Signatures removed by userscript>\n'
    }

    console.log('Done, Clear interval.')

    clearInterval(intervalId)
}

intervalId = setInterval(Run, 1000 * 0.5)