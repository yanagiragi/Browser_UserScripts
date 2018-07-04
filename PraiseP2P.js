// ==UserScript==
// @name         PraiseP2P
// @namespace    yr
// @version      0.3
// @description  All Hail P2P
// @author       Yanagiragi
// @match        https://www.facebook.com/messages/t/*
// @grant        none
// ==/UserScript==

// Big Thanks to @Dansnow and @EyiLee

(function() {
    'use strict';

    //override event handler later for react.js
    setTimeout(setKeyPressHandler, 1000 * 5);

})();

function setKeyPressHandler()
{
    console.log("Start Working")

    // For Chrome
	document.addEventListener('keydown', KeyHandler)
}

function KeyHandler(e)
{
	e = e || window.event;
	if (e.key == "F2") { // F2
        getSpan();
    }
}

// Find target node every time since facebook change dom
function getSpan()
{
    var placeHolder = "大大 <(_ _)>";

	// returns HTMLCollection
    var targetNode = document.querySelector("span[data-text]");

	if(targetNode){
		targetNode.innerHTML += placeHolder;
		document.querySelector(".notranslate").dispatchEvent(new Event("input", {bubbles: true, cancelable: true}))
    }
}
