app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'partials/slide.jade',
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
    .when('/login', {
      templateUrl : 'partials/login.jade',
      controller : 'loginCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
