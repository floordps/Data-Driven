$(function(){
  var form = $('#wizard');

  form.steps({
    headerTag: 'h3',
    bodyTag: 'div',
    transitionEffect: 'slideLeft',
    stepsOrientation: 'vertical',
    enableAllSteps: true,
    enableKeyNavigation: true,
    enablePagination: true,
    startIndex: 0,
    showFinishButtonAlways: true,
    autoFocus: true
  });
});
