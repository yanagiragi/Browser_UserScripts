// ==UserScript==
// @name         PraiseP2P
// @namespace    yr
// @version      0.2
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
	document.onkeydown = KeyPressHandler
}

function KeyPressHandler(e)
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
    var spans = document.getElementsByTagName("span");
    var targetNode = null;

	for (var idx = 0; idx < spans.length; ++idx){
        if(spans[idx].getAttribute("data-text") == "true"){
			break;
        }
	}

	if(idx < spans.length){
		targetNode = spans[idx]
    }

	if(targetNode){
		targetNode.innerHTML += placeHolder;
		document.getElementsByClassName("notranslate")[0].dispatchEvent(new Event("input", {bubbles: true, cancelable: true}))
	}
}
