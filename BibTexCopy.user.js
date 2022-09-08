// ==UserScript==
// @name         BibTexCopy
// @namespace    Yr
// @version      1.0
// @description  Copy BibTex citation on google scholar
// @author       Toudaimori
// @match        https://scholar.google.com/scholar?*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';
    const citeBtns = [...document.querySelectorAll('.gs_or_svg')];
    const handler = (event) => {
        let x = null;
        const findX = () => {
            console.log([...document.querySelectorAll('a.gs_citi')][0].href)
            const btns = [...document.querySelectorAll('a.gs_citi')];
            x = btns[0];
            if (!x) {
                setTimeout(findX, 500);
            } else {
                const href = x.href;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: href,
                    onload: function(response) {
                        x.onclick = (event) => {
                            GM_setClipboard(response.responseText, "text");
                            console.log(response.responseText);
                            event.preventDefault();
                        }
                    }
                })
            }
        }

        setTimeout(findX, 500);
        console.log('click')
    };

    citeBtns.map(x => {
        x.onclick = () => {
         setTimeout(handler, 100);
        }
    });
})();