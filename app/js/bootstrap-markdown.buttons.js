$(function() {
  $('#text-editor').markdown({
    iconlibrary: 'fa',
    hiddenButtons: 'cmdPreview',
    disabledButtons: 'cmdPreview',
    additionalButtons: [
      [{
        name: 'slideButton',
        data: [{
          name: 'addSlide',
          toggle: false,
          title: 'Add Slide',
          icon: 'fa fa-plus',
          callback: function(e) {
            var end = e.getContent().length;
            e.setSelection(end, end);
            e.replaceSelection('\n---\n');
          }
        }]
      }, {
        name: 'graphButton',
        data: [{
          name: 'insertGraph',
          title: 'Graphs',
          toggle: false,
          icon: 'fa fa-line-chart',
          callback: function(e) {
            $('#tableModal').modal({
              show: true
            });
          }
        }]
      }, {
        name: 'tableButton',
        data: [{
          name: 'insertTable',
          title: 'Table',
          toggle: false,
          icon: 'fa fa-table',
          callback: function(e) {
            $('#tableModal').modal({
              show: true
            });
          }
        }]
      }]
    ]
  });
});
