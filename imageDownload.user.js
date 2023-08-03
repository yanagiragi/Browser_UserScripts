// ==UserScript==
// @name        imageDownload
// @namespace   Yr
// @include     http://*.jpg
// @include     https://*.jpg
// @include     http://*.jpeg
// @include     https://*.jpeg
// @include     http://*.png
// @include     https://*.png
// @include     http://*.bmp
// @include     https://*.bmp
// @version     1
// @grant       none
// ==/UserScript==

// Configs
var autoClose = true;

// Main Code
function closeWindows() {
    window.close();
    clearInterval(set);
}

(function () {
    'use strict';
    var filename = location.pathname.substr(location.pathname.lastIndexOf('/') + 1);
    var mime = filename.substr(filename.lastIndexOf('.') + 1);
    var downloadLink = document.createElement("a");
    downloadLink.href = location.href;
    downloadLink.download = filename;
    downloadLink.type = 'image/' + mime;
    document.body.appendChild(downloadLink);

    console.log('start download ' + filename);

    downloadLink.click();

    if (autoClose)
        set = setInterval(closeWindows, 1000 * 3);
})();