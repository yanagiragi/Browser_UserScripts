// ==UserScript==
// @name         Google Drive Folder Enhance
// @namespace    Yr
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://drive.google.com/drive/folders/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const AlwaysComfirm = function () {
        const comfirms = [...document.querySelectorAll('.h-De-Vb.h-De-Y')];
        comfirms.map(x => x.click())
    }
    setInterval(AlwaysComfirm, 500);
})();