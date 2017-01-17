// ==UserScript==
// @name         Eyny
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*.eyny.com/index.php
// @grant        none
// ==/UserScript==

// Purpose : with entering "eyny.com", you will grant
// 1. new url with www****.eyny.com, to avoid imgur.com blocking www**.eyny.com
// 2. Already agreeed you are over 18 years old :)
// 3. No longer access homepage twice if you're trying to access some forums

function checkDomain(){
    var loc = location.hostname.toString();     // domain
    var str = loc.substr(loc.indexOf('www')); 
    str = str.substr(0, str.indexOf('.'));      // get number of www**.eyny.com
    
    var org = loc.substr(loc.indexOf('.'));     // original postfix of '.eyny.com'

    if(str.length <= 6){
        str = str + (Math.floor(Math.random() * 100)).toString(); // new prefix : www****.eyny
    }

    str = str + org;
    document.cookie = 'djAX_e8d7_agree=206;path=/;domain=.eyny.com'; // dealing r18 authentication

    var path = location.pathname;
    if(path.indexOf("/index.php") === 0){
        path = '/forum.php?view=all'; // avoid access homepage twice
    	console.log('detecting access index.php');
        str += path;
        document.location = 'http://' + str ;
    }
}

(function() {
    'use strict';
    checkDomain();
})();