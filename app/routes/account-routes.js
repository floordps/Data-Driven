app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'partials/account.jade',
      controller : 'clientCtrl'
    })
    .when('/:slidename', {
      templateUrl : 'partials/master.jade',
      controller : 'editorCtrl'
    })
    .when('/:slidename/editor', {
      templateUrl : 'partials/editor.jade',
      controller : 'editorCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);