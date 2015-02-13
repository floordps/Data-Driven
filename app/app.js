var app = angular.module('data-driven', ['ngRoute']);

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
    .otherwise({
      redirectTo: '/'
    });
}]);
