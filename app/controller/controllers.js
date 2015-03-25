app.controller('clientCtrl', function($rootScope, $scope, socket, $http, $routeParams) {
  var uname = $routeParams.username,
    sname = $routeParams.slidename;
  $http.get('/view/' + uname + '/' + sname).success(function(data) {
    $('#slideMd').html(data.slides);
      Reveal.initialize({
      controls: true,
      keyboard: true,
      margin: 0.1,
      progress: true,
      transition: 'zoom',
      transitionSpeed: 'slow',
      multiplex: {
        secret: null,
        id: '1',
        url: ''
      },
      dependencies: [
        { src: '/socket.io/socket.io.js', async: true },
        { src: '/app/plugin/multiplex/client.js', async: true },
        { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: '/app/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: '/app/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } }
      ]
      });

  });
  
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

app.controller('editorCtrl', function($scope, $http, $routeParams) {
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

  $http.get('/account/slide/' + $routeParams.slidename).success(function(data) {
    if(data) {
      $('#text-editor').text(data.slides);
    }
  });
  $scope.updateMarkdown = function() {
    var md = $('#text-editor').val();
    $http.post('/account/slide/' + $routeParams.slidename, { slides: md }).success(function(data) {
      if(data && !data.success) {
        alert('fail');
      }
    });
  };
});

app.controller('graph', function($scope) {
});
app.controller('loginCtrl', function(){});

app.controller('userCtrl', function($scope, $http, userProfile) {
  $scope.username = userProfile.displayName;
  $scope.slideShows = [];
  $http.get('/account/slide').success(function(data) {
    $scope.slideShows = data;
  });
});

app.controller('userSlidesCtrl', function($scope, $routeParams, $http) {
  //$scope.username = userProfile.displayName;
  $scope.slideShows = [];
  var uname = $routeParams.username;
  $http.get('/view/' + uname).success(function(data) {
    $scope.slideShows = data;
  });
});
