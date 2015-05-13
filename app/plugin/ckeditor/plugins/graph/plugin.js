CKEDITOR.plugins.add('graph', {
  init: function(editor) {
    editor.ui.addButton('graph', {
      label: 'Insert Graph',
      command: 'graph',
      icon: this.path + 'graph.png',
      toolbar: 'colors'
    });
    editor.addCommand('graph', new CKEDITOR.command( editor, {
      exec: function(editor) {
        $('#graphModal').modal('show');
      }
    }));
    // editor.addCommand('graph', new CKEDITOR.dialogCommand('graphDialog'));
    // CKEDITOR.dialog.add('graphDialog', this.path + 'dialogs/graph.js');
  }
})
