// ==UserScript==
// @name         Fix Yahoo Transit Jp Mobile
// @namespace    Yr
// @version      1.0
// @description  Fix redirect not work in Firefox mobile
// @author       yanagiragi
// @match        https://approach.yahoo.co.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.co.jp
// @grant        none
// ==/UserScript==

function parseQuery (queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

(function () {
    'use strict';
    const url = new URL(location.href)
    const search = url.search
    const query = parseQuery(search)
    if (query.src) {
        location.href = query.src
    }
    else {
        alert('redirect failed, query = ${JSON.stringify(query)}')
    }
})();