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

app.directive('master', function($compile, $http, charts) {
  return {
    restrict: 'E',
    templateUrl: 'partials/masterSlide.jade',
    link: function(scope, elem, attr) {
      Reveal.addEventListener('ready', function(event) {
        scope.graph = {};
        $compile($('.graph'))(scope);
        $('.graph').each(function() {
          var id = $(this).attr('reportId');
          var x = $(this).attr('xValue');
          var y = $(this).attr('yValue');
          var graphType = $(this).attr('graphType');
          $http.post('/report/'+id, { username: scope.slideshow.username, slidename: scope.slideshow.slideName }).success(function(data) {
            var row = data.factMap['T!T'].rows;
            var column = data.reportExtendedMetadata.detailColumnInfo;
            var xPos, yPos;
            Object.keys(column).forEach(function(key, index) {
              if (column[key].label === x) {xPos = index;}
              if (column[key].label === y) {yPos = index;}
            });
            switch(graphType) {
              case 'multi-bar-chart' :
                scope.graph[id] = charts.multiBarChart(id, row, xPos, yPos);
                break;
              default :
                break;
            }
            // var obj = [{
            //   key: "Report: " + id,
            //   values: arr.map(function(val, i) { return [ val.dataCells[1].value, val.dataCells[2].value ]; })
            // }];
            // scope.graph[id] = obj;
          });
        });
      });
    }
  };
});

app.directive('menu', function($http, $window, $compile) {
  return {
    restrict: 'E',
    link: function(scope, elem, attr) {
      $http.get('/loggedIn').success(function(data) {
        var menuOption = '';
        if (data === 'true') {
          var menuOptions = [{name: 'Home', link: '/'},
                             {name: 'My Account', link: '/account'},
                             {name: 'Logout', link: '/logout'}];
                                       menuOptions.forEach(function(menu) {
            menuOption = menuOption + '<li role=\'presentation\'>'+
              '<a role=\'menuitem\' href=\'' + menu.link + '\'>' + menu.name + '</a>'+
            '</li>';
          });
         } else {
           //elem.html('<div id=\'menu\' class=\'pull-right\'>
           //<a data-toggle=\'modal\' href=\'#loginModal\' class=\'btn btn-primary\' style=\'font-weight:bold;\'>
           //<span class=\'fa-stack\'><i class=\'fa fa-cloud fa-stack-2x\'></i><i class=\'fa fa-stack-1x\' style=\'color:#1E90FF;font-style:italic;font-weight:bold;\'>sf</i></span>&nbsp Log In</a></div>');
           menuOption = '<h3>Login</h3><form name=\'loginForm\' ng-submit=\'login(email, password)\'novalidate>' +
                          '<div class=\'form-group\'><input type=\'email\' placeholder=\'Salesforce Email\' ng-model=\'email\' class=\'form-control\' required></div>' +
                          '<div class=\'form-group\'><input type=\'password\' placeholder=\'Salesforce Password\' ng-model=\'password\' class=\'form-control\' required></div>' +
                          '<div class=\'form-group\'><input type=\'submit\' class=\'btn btn-primary form-control\' value=\'Login\' ng-disabled=\'loginForm.$invalid\'></div>' +
                        '</form>';
        }
        elem.html('<div class=\'dropdown pull-right\'>'+
                  '<a class=\'btn btn-primary dropdown-toggle\' data-toggle=\'dropdown\'><span class=\'fa-stack\'><i class=\'fa fa-cloud fa-stack-2x\'></i><i class=\'fa fa-stack-1x\' style=\'color:#1E90FF;font-style:italic;font-weight:bold;\'>sf</i></span>&nbsp<i class=\'caret\' style=\'margin-left: 5px;\'></i></a>'+
                  '<ul class=\'dropdown-menu dropdown-menu-right\' role=\'menu\'>'+
                    menuOption +
                  '</ul>'+
                '</div>');
        $compile($('.dropdown-menu'))(scope);
        scope.login = function(email, password) {
          $http.post('/login', {email: email, password: password}).success(function(data) {
            if (data.success) {
              $window.location.href = '/account';
            }
          }).error(function(data) {});
        };
        // $('menu .dropdown .dropdown-menu form').on('submit', function(e) {
        //   e.preventDefault();
        //   var email = $('menu .dropdown .dropdown-menu form input[type="email"]').val();
        //   var password = $('menu .dropdown .dropdown-menu form input[type="password"]').val();
        //   $http.post('/login', {email: email, password: password}).success(function(data) {
        //     if (data.success) {
        //       $window.location.href = '/account';
        //     }
        //   });
        // });
      });
    }
  };
});
