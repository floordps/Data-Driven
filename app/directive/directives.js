app.directive('slides', function($compile, $http, charts) {
  return {
    restrict: 'E',
    templateUrl: 'partials/slideShow.jade',
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
              case 'pie-chart' :
                scope.graph[id] = charts.pieChart(id, row, xPos, yPos);
                break;
              default :
                break;
            }
          });
        });
      });
      scope.yFunction = function() {
        return function(d) {return d.y;};
      };
      scope.xFunction = function() {
        return function(d) {return d.key;};
      };
    }
  };
});

app.directive('menu', function($http, $window, $compile, $timeout) {
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
            menuOption = menuOption + '<li role="presentation">'+
              '<a role="menuitem" href="' + menu.link + '">' + menu.name + '</a>'+
            '</li>';
          });
         } else {
           menuOption = '<h3>Login</h3><form name="loginForm" ng-submit="login(email, password, token)"novalidate>' +
                          '<div class="form-group"><input type="email" placeholder="Salesforce Email" ng-model="email" class="form-control" required></div>' +
                          '<div class="form-group"><input type="password" placeholder="Salesforce Password" ng-model="password" class="form-control" required></div>' +
                          '<div class="form-group"><a ng-click="showTokenField()">Token (Optional)</label></a>' +
                          '<div class="form-group"><input type="text" placeholder="Security Token" ng-model="token" class="form-control" ng-hide="hideToken"></div>' +
                          '<div class="form-group"><button type="submit" ladda="load" data-style="slide-left" class="btn btn-primary form-control ladda-button" ng-disabled="loginForm.$invalid">Login</button></div>' +
                        '</form>';
        }
        elem.html('<div class="dropdown pull-right">'+
                  '<a class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span class="fa-stack"><i class="fa fa-cloud fa-stack-2x"></i><i class="fa fa-stack-1x" style="color:#1E90FF;font-style:italic;font-weight:bold;">sf</i></span>&nbsp<i class="caret" style="margin-left: 5px;"></i></a>'+
                  '<ul class="dropdown-menu dropdown-menu-right" role="menu">'+
                    menuOption +
                  '</ul>'+
                '</div>');
        $compile($('.dropdown-menu'))(scope);
        scope.hideToken = true;
        scope.showTokenField = function() {
          scope.hideToken = !scope.hideToken;
        };
        scope.login = function(email, password, token) {
          scope.load = true;
          $http.post('/login', {email: email, password: password}).success(function(data) {
            if (data.success) {
              $window.location.href = '/account';
            }
            scope.load = false;
          }).error(function(data) {
            scope.load = false;
          });
        };
      });
    }
  };
});
