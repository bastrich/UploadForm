$(document).ready(function(){
/*Start DocumentReady*/
var url=document.location.href;
$.each($("#menu ul li a"),function(e){
if(url==this.href){$(this).attr('onclick', 'return false;');};
if(url==this.href){$(this).addClass('act');};
});
$.each($("#menu ul li ul li a"),function(e){
if(url==this.href){$(this).attr('onclick', 'return false;');};
if(url==this.href){$(this).addClass('act2');};
});
$.each($("#poligrafiya ul li a"),function(e){
if(url==this.href){$(this).attr('onclick', 'return false;');};
if(url==this.href){$(this).addClass('act');};
});
$.each($("#poligrafiya ul li ul li a"),function(e){
if(url==this.href){$(this).attr('onclick', 'return false;');};
if(url==this.href){$(this).addClass('act2');};
});
/*End DocumentReady*/
});