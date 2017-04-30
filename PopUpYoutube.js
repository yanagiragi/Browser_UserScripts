// ==UserScript==
// @name        PopUpYoutube
// @namespace   yrYoutube
// @include     https://www.youtube.com/watch?v=*
// @version     1
// @grant       none
// ==/UserScript==

var container = document.getElementById("page-container");
var yrbtn = document.createElement("A");

yrbtn.style.margin = "50px";
yrbtn.style.position = "fixed";
yrbtn.appendChild(document.createTextNode("Sugoi"));
yrbtn.href=`javascript: window.open(this.location.href.replace('watch','watch_popup'), "_blank","width=800,height=600,resizable"); window.close();`;

container.insertBefore(yrbtn, container.firstChild);