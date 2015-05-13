CKEDITOR.dialog.add('graphDialog', function(editor) {
  return {
    title: 'Graph',
    minWidth: 400,
    minHeight: 200,
    contents: [
      {
        id: '',
        label: '',
        elements: [
          {
            type: 'html',
            html: '<form><div class="form-group"><select ng-model="graph.graphType" required="required" class="form-control"><option value="" disabled="disabled" selected="selected">Select a Graph</option><option ng-repeat="type in gTypes" value="{{type.name}}">{{type.type}}</option></select></div></form>'
          }
        ]
      }
    ]
  }
})
