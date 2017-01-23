// ==UserScript==
// @name         Eyny_OrderByDate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*.eyny.com/forum-*.html
// @match        http://*.eyny.com/forum.php*
// @grant        none
// ==/UserScript==

// Purpose : with entering "eyny.com", you will grant
// 1. new url with www****.eyny.com, to avoid imgur.com blocking www**.eyny.com
// 2. Already agreeed you are over 18 years old :)
// 3. No longer access homepage twice if you're trying to access some forums

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
    return null;
}

function sortByDate_php(){
    var id = getQueryVariable('fid');
    console.log(id);

    let skip = getQueryVariable('orderby');
    let view = getQueryVariable('view');
    let mod = getQueryVariable('mod');
    if(skip != null || view == 'all' || mod == 'viewthread')
        return;

    if(exclude.indexOf(id) < 0){
        var postfix = location + '&filter=author&orderby=dateline';
        location.replace(postfix);    
    }
    
    
}

function sortByDate_html(){
    var loc = location.hostname.toString();     // domain
    var path = location.pathname;
    
    var id = path.substr(7, path.length);
    id = id.substr(0, id.indexOf('-'));
    
    if(exclude.indexOf(id) < 0){
        console.log('ready to sort');
        var postfix = 'forum.php?mod=forumdisplay&fid=' + id + '&filter=author&orderby=dateline';
        location.replace(postfix);
    }
}

var exclude = ['22'];

(function() {
    'use strict';
    if(location.pathname == "/forum.php")
        sortByDate_php();
    else
        sortByDate_html();
})();