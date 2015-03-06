app.controller('clientCtrl', function($rootScope, $scope, socket) {
  $scope.messages = [];
  socket.on('init', function (data) {
    $rootScope.name = data.name;
  });

  socket.on('send:message', function (message) {
    $scope.messages.push({
      user: message.user,
      text: message.text,
      });
  });

  $scope.sendMessage = function () {
    socket.emit('send:message', {
      message: $scope.message
    });

    $scope.messages.push({
      user: $rootScope.name,
      text: $scope.message
    });

    $scope.message = '';
  };
});

app.controller('editorCtrl', function($scope, $http) {
  $scope.checkReport = function () {
    $http.post('/report/' + $scope.reportId + '/desc').success(function(data) {
      if(data) {
        $('#graphModal .modal-body').append(JSON.stringify(data));
      } else {
        $('#graphModal .modal-body').append('check err');
      }
    });
  };
});

app.controller('graph', function($scope) {
});

app.controller('loginCtrl', function(){});
