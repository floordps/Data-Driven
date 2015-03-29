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
          $http.post('/report/'+id, { username: scope.slideshow.username, slidename: scope.slideshow.slideName }).success(function(data) {
            var arr = data.factMap['T!T'].rows;
            var obj = [{
              key: "Report: " + id,
              values: arr.map(function(val, i) { return [ val.dataCells[1].value, val.dataCells[2].value ]; })
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
          $http.post('/report/'+id, { username: scope.slideshow.username, slidename: scope.slideshow.slideName }).success(function(data) {
            var arr = data.factMap['T!T'].rows;
            var obj = [{
              key: "Report: " + id,
              values: arr.map(function(val, i) { return [ val.dataCells[1].value, val.dataCells[2].value ]; })
            }];
            scope.graph[id] = obj;
          });
        });
      });
    }
  };
});

app.directive('menu', function($http) {
  return {
    restrict: 'E',
    link: function(scope, elem, attr) {
      $http.get('/loggedIn').success(function(data) {
        if (data === 'true') {
          var menuOptions = [{name: 'Home', link: '/'},
                             {name: 'My Account', link: '/account'},
                             {name: 'Logout', link: 'logout'}];
          var menuOption = '';
          menuOptions.forEach(function(menu) {
            menuOption = menuOption + '<li role=\'presentation\'>'+
              '<a role=\'menuitem\' href=\'' + menu.link + '\'>' + menu.name + '</a>'+
            '</li>';
          });
          elem.html('<div class=\'dropdown pull-right\'>'+
                    '<span class=\'fa fa-bars fa-3x dropdown-toggle\' data-toggle=\'dropdown\'></span>'+
                    '<ul class=\'dropdown-menu dropdown-menu-right\' role=\'menu\'>'+
                      menuOption +
                    '</ul>'+
                  '</div>');
         } else {
          elem.html('<div id=\'menu\' class=\'pull-right\'><a class=\'btn btn-primary\' href=\'/auth/google\'><span class=\'fa fa-google-plus\'> &nbspLog In</span></a></div>');
        }
      });
    }
  };
});
