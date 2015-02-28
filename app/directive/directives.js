app.directive('chat', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/chat.jade'
  };
});

app.directive('drag', function() {
  return {
    restrict: 'A',
    link:  function(scope, elem, attr) {
      elem.draggable();
    }
  };
});

app.directive('audience', function($compile, $http) {
  return {
    restrict: 'E',
    templateUrl: 'partials/audienceSlide.jade',
    link: function(scope, elem, attr) {
      Reveal.addEventListener('ready', function(event) {
        scope.graph = {};
        $compile($('.graph'))(scope);
        $('.graph').each(function() {
          var id = $(this).attr('reportId');
          $http.post('/report/'+id).success(function(data) {
            var arr = data.factMap['T!T'].rows;
            var obj = [{
              key: id,
              values: arr.map(function(val, i) { return [ i, +new Date(val.dataCells[6].value) ]; })
            }];
            scope.graph[id] = obj;
          });
        });
      });
    }
  };
});

app.directive('master', function($compile, $http) {
  return {
    restrict: 'E',
    templateUrl: 'partials/masterSlide.jade',
    link: function(scope, elem, attr) {
      Reveal.addEventListener('ready', function(event) {
        scope.graph = {};
        $compile($('.graph'))(scope);
        $('.graph').each(function() {
          var id = $(this).attr('reportId');
          $http.post('/report/'+id).success(function(data) {
            var arr = data.factMap['T!T'].rows;
            var obj = [{
              key: id,
              values: arr.map(function(val, i) { return [ i, +new Date(val.dataCells[6].value) ]; })
            }];
            scope.graph[id] = obj;
          });
        });
      });
    }
  };
});
