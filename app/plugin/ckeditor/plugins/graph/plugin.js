CKEDITOR.plugins.add('graph', {
  init: function(editor) {
    editor.ui.addButton('graph', {
      label: 'Insert Graph',
      command: 'graph',
      icon: this.path + 'graph.png',
      toolbar: 'colors'
    });
    editor.addCommand('graph', {
      exec: function() {
        $('#graphModal').modal('show');
      }
    })
  }
});
