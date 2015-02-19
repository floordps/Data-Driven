$(function() {
  $('#text-editor').markdown({
    iconlibrary: 'fa',
    hiddenButtons: 'cmdPreview',
    disabledButtons: 'cmdPreview',
    width: '600',
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
            $('#graphModal').modal({
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
            $('#createTable').on('click', function() {
              var rows = document.getElementById('rows').value;
              var columns = document.getElementById('columns').value;
              var table = '\n';
              rows++;
              for(var i = 0; i < rows; i++) {
                table = table + '|';
                for (var j = 0; j < columns; j++) {
                  if (i == 1) {
                    table = table + '------|';
                  } else {
                    table = table + '      |';
                  }
                }
                table = table + '\n';
              }
              e.replaceSelection(table);
              e.setSelection(getSelection(), getSelection()+table.length);
              $('#tableModal').modal('hide');
            });
          }
        }]
      }]
    ]
  });
});
