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

  $scope.slideShows = [
    {name: 'test1', date: '3-15-2015', author: 'Data-Driven', play: 'Play'},
    {name: 'test2', date: '3-15-2015', author: 'Data-Driven', play: 'Play'},
    {name: 'test3', date: '3-15-2015', author: 'Data-Driven', play: 'Play'}
  ];
});

app.controller('editorCtrl', function($scope, $http) {
  $scope.showDetails = true;
  $scope.reportDetails = true;
  $scope.graph = {};
  $scope.showGraphType = function(e) {
    if (e == 'rID') {
      $scope.reportDetails = false;
    } else {
      $scope.reportDetails = true;
    }
  };

  $scope.options = [
    {name: 'xAxisFmt', option: 'X Axis Data Format'},
    {name: 'yAxisFmt', option: 'Y Axis Date Format'},
    {name: 'showYAxis', option: 'Show X Axis'},
    {name: 'showXAxis', option: 'Show Y Axis'},
    {name: 'isArea', option: 'Is Area'},
    {name: 'interactive', option: 'Interactive'},
    {name: 'guideLine', option: 'Interactive Guide Line'},
    {name: 'tooltips', option: 'Tooltips'},
    {name: 'clipEdge', option: 'Clip Edge'},
    {name: 'clipVoronoi', option: 'Clip Voronoi'}
  ];

  $scope.gTypes = [
    {name: 'line-chart', type: 'Line Charts'},
    {name: 'stacked-area-chart', type: 'Stacked Area Charts'},
    {name: 'multi-bar-chart', type: 'Multi Bar Charts'},
    {name: 'multi-bar-horizontal-chart', type: 'Multi Bar Horizontal Charts'},
    {name: 'discrete-bar-chart', type: 'Discrete Bar Charts'},
    {name: 'pie-chart', type: 'Pie Charts'},
    {name: 'scatter-chart', type: 'Scatter Charts'},
    {name: 'sparkline-chart', type: 'Sparkline  Charts'},
    {name: 'cumulative-line-chart', type: 'Cumulative Line Charts'},
    {name: 'line-with-focus-chart', type: 'Line with Focus Charts'}
  ];

  $scope.labels = [];

  $scope.checkReport = function () {
    $scope.load = true;
    $http.post('/report/' + $scope.graph.reportId + '/desc').success(function(data) {
      if(data) {
        data.cols.forEach(function(data) {
        $scope.labels.push(data.label);
        $scope.showDetails = false;
        });
      } else {
        $('#graphModal .modal-body').append('check err');
        $scope.showDetails = true;
      }
      $scope.load = false;
    });
  };

  $scope.$watch('graph', function() {
    $('#graphModal').data('graph', $scope.graph);
  }, true);
});

app.controller('graph', function($scope) {
});
app.controller('loginCtrl', function(){});

app.controller('userCtrl', function($scope, userProfile) {
  $scope.username = userProfile.displayName;
  $scope.slideShows = [
    {name: 'test1', date: '3-15-2015', author: 'Data-Driven', play: 'Play'},
    {name: 'test2', date: '3-15-2015', author: 'Data-Driven', play: 'Play'},
    {name: 'test3', date: '3-15-2015', author: 'Data-Driven', play: 'Play'}
  ];
});
