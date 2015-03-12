var app = angular.module('data-driven', ['ngRoute', 'nvd3ChartDirectives', 'angular-ladda']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'partials/index.jade',
      controller : 'clientCtrl'
    })
    .when('/master', {
      templateUrl : 'partials/master.jade',
      controller : 'clientCtrl'
    })
    .when('/login', {
      templateUrl : 'partials/login.jade',
      controller : 'loginCtrl'
    })
    .when('/editor', {
      templateUrl : 'partials/editor.jade',
      controller : 'editorCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
