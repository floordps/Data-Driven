app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'partials/index.jade',
      controller : 'clientCtrl'
    })
    .when('/view/:username', {
      templateUrl : 'partials/username.jade',
      controller : 'clientCtrl'
    })
    .when('/view/:username/:slidename', {
      templateUrl : 'partials/slide.jade',
      controller : 'clientCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
