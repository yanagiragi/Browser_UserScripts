// ==UserScript==
// @name        GoogleImageRedirect
// @namespace   yanagiGoogleImageRedirect
// @include     https://www.google.com.tw/imgres?imgurl=*
// @version     1
// @grant       none
// ==/UserScript==

var set;

// example for stack overflow
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var imageUrl = getParameterByName('imgurl', location.href)

location.href = imageUrl

//set = setInterval(changeWindows, 1000 * 1);

function changeWindows(){
  clearInterval(set);
  location.herf = imageUrl
}