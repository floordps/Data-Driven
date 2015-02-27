app.controller('clientCtrl', function($scope, $timeout, $compile, $http) {
  Reveal.addEventListener('ready', function(event) {
    $scope.graph = {};
    $compile($('.graph'))($scope);
    $('.graph').each(function() {
      var id = $(this).attr('reportId');
      $http.post('/report/'+id).success(function(data) {
        var arr = data.factMap['T!T'].rows;
        var obj = [{
          key: id,
          values: arr.map(function(val, i) { return [ i, +new Date(val.dataCells[6].value) ]; })
        }];
        $scope.graph[id] = obj;
      });
    });
  });
});

app.controller('editorCtrl', function($scope, $routeParams, $http) {
  var reportId = $routeParams.id;
  $http.get('/editor/' + reportId).success(function(data) {
    if(data) {
      $('#text-editor').text(data.slides);
    }
  });
  $('#editorSubmit').on('click', function(e) {
    e.preventDefault();
    $http.post('/editor/' + reportId, { id: reportId, slides: $('#text-editor').val() }).success(function(data) {
      console.log('done');
    });
  });
});

app.controller('graph', function($scope) {
});
