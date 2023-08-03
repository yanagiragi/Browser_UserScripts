// ==UserScript==
// @name         Twitter Download Image Context Menu
// @namespace    Yr
// @version      1.0
// @description  Context menu to download original size at Twitter status
// @author       yanagiragi
// @match        https://twitter.com/*/status/*
// @grant        GM_download
// ==/UserScript==

(function () {
    'use strict';

    var clickedEvent = null;

    var menu = document.createElement("div");
    menu.id = "contextmenu";
    menu.className = "hidden";

    var option1 = document.createElement("div");
    option1.classList.add("yrOptions");
    option1.innerHTML = "Download Image";
    bindEvent(option1, "click", ClickDownloadOption);

    var option2 = document.createElement("div");
    option2.classList.add("yrOptions");
    option2.innerHTML = "Turn Off userScript";
    bindEvent(option2, "click", ClickTurnOffOption);

    menu.appendChild(option1);
    menu.appendChild(option2);

    document.body.appendChild(menu);

    addGlobalStyle(`
#contextmenu{
    width:180px;
    height: 50px;
    background-color:#f2f2f2;
    position:absolute;
    border:1px solid #BFBFBF;
    box-shadow:2px 2px 3px #aaaaaa;
}`)

    addGlobalStyle(`
.yrOptions{
    padding: 3px;
}`)

    addGlobalStyle(`
.yrOptions:hover{
    background-color: cadetblue;
}`)

    addGlobalStyle(`
.show{
    display:block;
}`)

    addGlobalStyle(`
.hidden{
    display:none;
}`)

    setTimeout(() => {
        console.log("Start Hooking");
        Setup()
        console.log("Hooked");
    }, 1000 * 5)

    function Setup() {
        const images = [...document.querySelectorAll('a[role=link][href*=status] img')]
        images.map(x => {
            bindEvent(x, "contextmenu", closeContextMenu);
            bindEvent(x, "mouseup", openNewContextMenu);
            bindEvent(x, "mousedown", closeNewContextMenu);

            let parent = x
            while (parent.tagName !== "A") {
                parent = parent.parentElement;
            }
            parent.setAttribute("oncontextmenu", "return false");
            bindEvent(document, "contextmenu", (event) => {
                console.log(event.target);
                return event.target.id !== "contextmenu"
            });
        })
    }

    function ClickDownloadOption(event) {
        let src = new URL(clickedEvent.target.src);
        let type = src.search.substring("?format=".length, src.search.indexOf("&"))
        let filename = src.pathname.substring("/media/".length)
        src = src.href.substring(0, src.href.indexOf("name=")) + "name=orig"
        console.log(`Download ${src} as ${filename}.${type}`);
        GM_download(src, `${filename}.${type}`);
        closeNewContextMenu();
    }

    function ClickTurnOffOption(event) {
        console.log("Turned Off");
        closeNewContextMenu();
        bindEvent(clickedEvent.target, "contextmenu", () => true);
        bindEvent(clickedEvent.target, "mouseup", () => true);
        bindEvent(clickedEvent.target, "mousedown", () => true);
    }

    function closeContextMenu() {
        return false;
    }

    function openNewContextMenu(ev) {
        ev.preventDefault()

        ev = ev || window.event;

        // save to global variable
        clickedEvent = ev;

        var btn = ev.button;
        if (btn == 2) {
            menu.style.left = ev.clientX + "px";
            menu.style.top = ev.clientY + "px";
            menu.className = "show";
        }

        return false;
    }

    function closeNewContextMenu(ev) {
        menu.className = "hidden";
    }

    function bindEvent(elem, eventType, callback) {
        var ieType = ["on" + eventType];
        if (ieType in elem) {
            elem[ieType] = callback;
        } else if ("attachEvent" in elem) {
            elem.attachEvent(ieType, callback);
        } else {
            elem.addEventListener(eventType, callback, false);
        }
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

})();
