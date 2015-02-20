var app = angular.module('data-driven', ['ngRoute', 'nvd3ChartDirectives']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'partials/index.jade',
      controller : 'clientCtrl'
    })
    .when('/master', {
      templateUrl : 'partials/master.jade',
      controller : 'masterCtrl'
    })
    .when('/login', {
      templateUrl : 'partials/login.jade',
      controller : 'clientCtrl'
    })
    .when('/editor', {
      templateUrl : 'partials/editor.jade',
      controller : 'editorCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
