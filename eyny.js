// ==UserScript==
// @name        Eyny
// @namespace   yanagiragi
// @include     http://*.eyny.com/index.php
// @version     1.3
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// ==/UserScript==

// Purpose : with entering "eyny.com", you will grant
// 1. new url with www****.eyny.com, to avoid imgur.com blocking www**.eyny.com
// 2. Already agreeed you are over 18 years old :)
// 3. No longer access homepage twice if you're trying to access some forums

const exclude = ['22']

$ = jQuery.noConflict(true);

document.cookie = 'djAX_e8d7_agree=206;path=/;domain=.eyny.com'; // dealing r18 authentication

$('#hd').siblings()[2].innerHTML = "" // get rid of announcement since it may contain link to specific forum

var forumId = []
$.ajax({
    url : `http://${location.hostname}/forum.php?view=all`, 
    async: false,
    //headers: { 'Access-Control-Allow-Origin': '*' },
    method : "get"
}).done(function(body){
  $(body).find('[href]').filter(function(){
    return this.href.match(/forum((-.)|(\.php\?view=all))/)
  }).each(function(index, value){
    forumId.push(value);
  })
})

$('[href]').filter(function(){ 
  return this.href.match(/forum((-.)|(\.php\?((view=all)|(mod=forumdisplay\&fid))))/)
}).each(function(index, value){
  if(value == 'forum.php?view=all'){
     $(this).attr('href',`http://yrwww${Math.floor(Math.random() * 1000 + 1000)}.eyny.com/forum.php?mod=forumdisplay&fid=${forum[index]}&filter=author&orderby=dateline`)  
  }
  else{
    if(value.href.match(/forum\.php\?mod=forumdisplay&fid./)){
      var fid = value.href.substring(value.href.lastIndexOf('=')+1,value.href.length);
      if(exclude.indexOf(fid) == -1)
       $(this).attr('href',`http://yrwww${Math.floor(Math.random() * 1000 + 1000)}.eyny.com/forum.php?mod=forumdisplay&fid=${fid}&filter=author&orderby=dateline`)  
    }
    else{
    var fid = value.href.substring( value.href.lastIndexOf('forum-')+6,value.href.lastIndexOf('-'))
    if(exclude.indexOf(fid) == -1)
     $(this).attr('href',`http://yrwww${Math.floor(Math.random() * 1000 + 1000)}.eyny.com/forum.php?mod=forumdisplay&fid=${fid}&filter=author&orderby=dateline`)  
    }
  }      
})

// No Longer Needed. Since there is native way to use
/*$("span[id*='category']").each(function(){
  $(this).prev().append('<a class="yrExpand" href="javascript: void(0);">Ep</a>')
})

$('.yrExpand').click(function(event){ 
  if($(event.target).parent().next().css('display') == 'none')
    $(event.target).parent().next().css('display','inline');
  else
    $(event.target).parent().next().css('display','none');
})*/
