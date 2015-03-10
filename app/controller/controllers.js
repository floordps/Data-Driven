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
  $scope.reportDetails = true;
  $scope.showGraphType = function(e) {
    if (e == 'rID') {
      $scope.reportDetails = false;
    } else {
      $scope.reportDetails = true;
    }
  };

  $scope.options = [
    {option: 'X Axis Data Format'},
    {option: 'Y Axis Date Format'},
    {option: 'Show X Axis'},
    {option: 'Show Y Axis'},
    {option: 'Is Area'},
    {option: 'Interactive'},
    {option: 'Interactive Guide Line'},
    {option: 'Tooltips'},
    {option: 'Clip Edge'},
    {option: 'Clip Voronoi'}
  ];

  $scope.gTypes = [
    {type: 'Line Charts'},
    {type: 'Stacked Area Charts'},
    {type: 'Multi Bar Charts'},
    {type: 'Multi Bar Horizontal Charts'},
    {type: 'Discrete Bar Charts'},
    {type: 'Pie Charts'},
    {type: 'Scatter Charts'},
    {type: 'Sparkline  Charts'},
    {type: 'Cumulative Line Charts'},
    {type: 'Line with Focus Charts'}
  ];

  $scope.labels = [];

  $scope.checkReport = function () {
    $http.post('/report/' + $scope.reportId + '/desc').success(function(data) {
      if(data) {
        data.cols.forEach(function(data) {
        $scope.labels.push(data.label);
        });
      } else {
        $('#graphModal .modal-body').append('check err');
      }
    });
  };
});

app.controller('graph', function($scope) {
});

app.controller('loginCtrl', function(){});
