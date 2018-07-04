// ==UserScript==
// @name         PraiseP2P
// @namespace    yr
// @version      0.1
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
	document.onkeypress = KeyPressHandler
}

function KeyPressHandler(e)
{
	e = e || window.event;
	var charCode = e.keyCode;
    
	if (charCode == "112") { // F1
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
