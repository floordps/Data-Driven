app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'partials/home.jade',
      controller : 'clientCtrl'
    })
    .when('/view/:username', {
      templateUrl : 'partials/username.jade',
      controller : 'userSlidesCtrl'
    })
    .when('/view/:username/:slidename', {
      templateUrl : 'partials/slide.jade',
      controller : 'clientCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
