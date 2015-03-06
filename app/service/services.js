app.factory('socket', function($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        $('.chatBody').stop(true, true).animate({ scrollTop: $('.chatBody')[0].scrollHeight}, 300);
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
      $('.chatBody').stop(true, true).animate({ scrollTop: $('.chatBody')[0].scrollHeight}, 300);
    }
  };
});
