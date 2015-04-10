app.directive('slides', function($compile, $http, charts) {
  return {
    restrict: 'E',
    templateUrl: 'partials/slideShow.jade',
    link: function(scope, elem, attr) {
      Reveal.addEventListener('ready', function(event) {
        scope.graph = {};
        $compile($('.graph'))(scope);
        $('.graph').each(function() {
          var id = $(this).attr('reportId') || $(this).attr('sobId'),
            x = $(this).attr('xValue'),
            y = $(this).attr('yValue'),
            graphType = $(this).attr('graphType'),
            graphData = id + graphType + x + y,
            rid = $(this).attr('reportId');
          $http.post((!!$(this).attr('reportId') ? '/report/' : '/sob/')+ id, { username: scope.slideshow.username, slidename: scope.slideshow.slideName, xColumn: x, yColumn: y }).success(function(data) {
            var row = [], column = [], xPos, yPos;
            if (!!rid) {
              row = data.factMap['T!T'].rows;
              column = data.reportExtendedMetadata.detailColumnInfo;
              Object.keys(column).forEach(function(key, index) {
                if (column[key].label === x) {xPos = index;}
                if (column[key].label === y) {yPos = index;}
              });
            } else {
              row = data.records.map(function(val, i) {
                return val.
              });
              console.log(row)
            }
            switch(graphType) {
              case 'multi-bar-chart' :
                scope.graph[graphData] = charts.multiBarChart(id, row, xPos, yPos);
                break;
              case 'pie-chart' :
                scope.graph[graphData] = charts.pieChart(id, row, xPos, yPos);
                break;
              case 'line-chart' :
                scope.graph[graphData] = charts.lineChart(id, row, xPos, yPos);
                break;
              case 'scatter-chart' :
                scope.graph[graphData] = charts.scatterChart(id, row, xPos, yPos);
                break;
              case 'discrete-bar-chart' :
                scope.graph[graphData] = charts.discreteBarChart(id, row, xPos, yPos);
                break;
              case 'stacked-area-chart' :
                scope.graph[graphData] = charts.stackedAreaChart(id, row, xPos, yPos);
                break;
              case 'multi-bar-horizontal-chart' :
                scope.graph[graphData] = charts.multiBarHorizontalChart(id, row, xPos, yPos);
                break;
              case 'sparkline-chart' :
                scope.graph[graphData] = charts.sparklineChart(id, row, xPos, yPos);
                break;
              case 'cumulative-line-chart' :
                scope.graph[graphData] = charts.cumulativeLineChart(id, row, xPos, yPos);
                break;
              case 'line-with-focus-chart' :
                scope.graph[graphData] = charts.lineWithFocusChart(id, row, xPos, yPos);
                break;
              default :
                break;
            }
          });
        });
      });
      scope.yFunction = function() {
        return function(d) {return d.y || d[1];};
      };
      scope.xFunction = function() {
        return function(d) {return d.key || d.x || d[0];};
      };
      scope.xAxisTickFormatFunction = function(){
	       return function(d){ return d3.time.format('%X')(new Date(d));};
      };
      scope.yAxisTickFormatFunction = function(){
	       return function(d){ return d3.time.format('%X')(new Date(d));};
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
                          '<div ng-hide="incorrectLogin" class="alert alert-danger alert-dismissable" role="alert"><button type="button" class="close" data-dismiss="alert"></button>Invalid Email / Password / Token</div>' +
                          '<div ng-hide="noConnection" class="alert alert-danger alert-dismissable" role="alert"><button type="button" class="close" data-dismiss="alert"></button>Oops! Something went wrong. Please try again later.</div>' +
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
        scope.noConnection = true;
        scope.incorrectLogin = true;
        scope.showTokenField = function() {
          scope.hideToken = !scope.hideToken;
        };
        scope.login = function(email, password, token) {
          scope.load = true;
          $http.post('/login', {email: email, password: password, token: token}).success(function(data) {
            if (data.success) {        scope.incorrectLogin = true;
              scope.incorrectLogin = true;
              scope.noConnection = true;
              $window.location.href = '/account';
            } else {
              scope.incorrectLogin = false;
            }
            scope.load = false;
          }).error(function(data) {
            scope.incorrectLogin = true;
            scope.noConnection = false;
            scope.load = false;
          });
        };
      });
    }
  };
});
