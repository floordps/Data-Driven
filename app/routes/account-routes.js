app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'partials/account.jade',
      controller : 'userCtrl'
    })
    .when('/:slidename', {
      templateUrl : 'partials/slide.jade',
      controller : 'masterCtrl'
    })
    // .when('/:slidename/editor', {
    //   templateUrl : 'partials/editor.jade',
    //   controller : 'editorCtrl'
    // })
    .otherwise({
      redirectTo: '/'
    });
}]);
app.value('userProfile', window.userProfile);
