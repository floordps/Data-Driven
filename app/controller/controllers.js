app.controller('clientCtrl', function($scope, socket) {
  $scope.messages = [];
  socket.on('init', function (data) {
    $scope.name = data.name;
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
      user: $scope.name,
      text: $scope.message
    });

    $scope.message = '';
  };

  $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
    if (!(document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement)) {
          $('#chat-panel').show();
        }
  });
});

app.controller('editorCtrl', function($scope) {

});

app.controller('graph', function($scope) {
});
