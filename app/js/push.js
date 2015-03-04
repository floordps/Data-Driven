$(function(){
	$(document).ready(function(){
  	$('#chatToggle').click(function(e){
    	var $parent = $(this).parent('nav');
      $parent.toggleClass("open");
      var navState = $parent.hasClass('open') ? "Hide" : "Show";
      $(this).attr("title", navState + " Chat");
			$('#chatToggle > span').toggleClass("navClosed").toggleClass("navOpen");
    	e.preventDefault();
  	});
  });
});
