// ==UserScript==
// @name        eyny-img
// @namespace   yanagiragi
// @include     http://*.eyny.com/thread*
// @include     http://*.eyny.com/forum.php?mod=viewthread&tid=*
// @version     1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// ==/UserScript==

$('img').each(function(index, value){ $(this).css('display','none')})