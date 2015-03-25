app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'partials/home.jade',
      controller : 'clientCtrl'
    })
    .when('/login', {
      templateUrl : 'partials/login.jade',
      controller : 'loginCtrl'
    })
    .when('/view/:username', {
      templateUrl : 'partials/username.jade',
      controller : 'userSlidesCtrl'
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
