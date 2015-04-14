app.controller('clientCtrl', function($scope, $http, $routeParams, $rootScope, SocketIO) {
  var uname = $routeParams.username,
    sname = $routeParams.slidename;
  $scope.slideShows = [];
  if(uname && sname) {
    $http.get('/api/view/' + uname + '/' + sname).success(function(data) {
      if(!data) {
        $location.path('/view/'+uname);
        return;
      }
      $scope.slideshow = data;
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
          id: data.multiplex.id,
          url: ''
        },
        dependencies: [
          { src: '/app/plugin/multiplex/client.js' },
          { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
          { src: '/app/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
          { src: '/app/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } }
        ]
      });
      Reveal.addEventListener('ready', function(event) {
        if($rootScope.room) SocketIO.emit('leave', $rootScope.room);
        $rootScope.room = data.multiplex.id;
        SocketIO.emit('join', $rootScope.room);
      });
      $scope.$on('$destroy', function(e) {
        Reveal.removeEventListeners();
        SocketIO.destroy();
      });
    });
  } else {
    $http.get('/api/view/all').success(function(data) {
      $scope.slideShows = data;
    });
  }
  $scope.setSearch = function(e) {
    $scope.search = e;
  };

});

app.controller('masterCtrl', function($scope, $http, $location, $routeParams, $rootScope, SocketIO) {
  var sname = $routeParams.slidename;
  $http.get('/api/account/' + sname).success(function(data) {
    if(!data) {
      $location.path('/');
      return;
    }
    $scope.slideshow = data;
    $('#slideMd').html(data.slides);
    Reveal.initialize({
      controls: true,
      keyboard: true,
      margin: 0.1,
      progress: true,
      transition: 'zoom',
      transitionSpeed: 'slow',
      multiplex: {
        secret: data.multiplex.secret,
        id: data.multiplex.id,
        url: ''
      },
      dependencies: [
        { src: '/app/plugin/multiplex/master.js' },
        { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: '/app/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: '/app/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } }
      ]
    });
    Reveal.addEventListener('ready', function(event) {
      if($rootScope.room) SocketIO.emit('leave', $rootScope.room);
      $rootScope.room = data.multiplex.id;
      SocketIO.emit('join', $rootScope.room);
    });
    $scope.$on('$destroy', function(e) {
      Reveal.removeEventListeners();
      SocketIO.destroy();
    });
  });
});

app.controller('userCtrl', function($scope, $http, userProfile, SocketIO) {
  $scope.slideshow = null;
  $scope.showDetails = true;
  $scope.reportDetails = true;
  $scope.graphError = true;
  $scope.saveEditorError = true;
  $scope.saveEditorSuccess = true;
  $scope.graph = {};
  $scope.username = userProfile.display_name;
  $scope.slideShows = [];
  $scope.tokens = userProfile.tokens;
  $scope.deleteSlide = function(sname) {
    $http.delete('/api/account/' + sname).success(function(data) {
      if(data && data.success) {
        $scope.slideShows = $.grep($scope.slideShows, function(obj, i) {
          return obj.slideName === sname;
        }, true);
      }
    });
  };
  $http.get('/api/account').success(function(data) {
    $scope.slideShows = data;
  });

  $scope.checkSlideShowName = function(a) {
    if(!$scope.slideShows.length) return true;
    return typeof(a) !== 'undefined' && $.grep($scope.slideShows, function(obj, i) {
      return obj.slideName === a;
    }).length === 0;
  };
  $scope.editSlide = function(name) {
    $('#text-editor').val(null);
    $http.get('/api/account/' + name).success(function(data) {
      if(data) {
        $scope.slideshow = data;
        $('#text-editor').val(data.slides);
        $('#editorModal').modal('show');
      } else {
        $scope.slideshow = { slideName: name };
        $('#newSlideshowModal').modal('hide');
        $('#editorModal').modal('show');
      }
    });
  };
  $scope.updateMarkdown = function() {
    $scope.loading = true;
    $scope.saveEditorError = true;
    $scope.saveEditorSuccess = true;
    var md = $('#text-editor').val();
    $http.post('/api/account/' + $scope.slideshow.slideName, { slides: md }).success(function(data) {
      $scope.loading = false;
      if(data && data.success) {
        if(data.slideshow && $scope.checkSlideShowName(data.slideshow.slideName)) $scope.slideShows.push(data.slideshow);
        $scope.saveEditorSuccess = false;
        SocketIO.emit('slideupdated', { id: data.slideshow.multiplex.id, slides: data.slideshow.slides });
      } else $scope.saveEditorError = false;

    }).error(function(data) {
      $scope.loading=false;
      $scope.saveEditorError = false;
    });
  };
  $scope.showGraphType = function(e) {
    if (e == 'rID') {
      $scope.reportDetails = false;
      $scope.reportTabSelected = false;
    } else {
      $scope.reportDetails = true;
      $scope.reportTabSelected = true;
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
    {name: 'clipVoronoi', option: 'Clip Voronoi'},
    {name: 'showLegend', option: 'Show Legend'},
    {name: 'staggerLabels', option: 'Stagger Labels'},
    {name: 'rotateLabels', option: 'Rotate Labels'}
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
    $scope.graphError = true;
    $http.post('/report/' + $scope.graph.reportId + '/desc', { username: userProfile.username, slidename: $scope.slideshow.slideName }).success(function(data) {
      if(data) {
        $scope.labels = [];
        data.cols.forEach(function(data) {
        $scope.labels.push(data.label);
        $scope.showDetails = false;
        });
      } else {
        $scope.showDetails = true;
        $scope.graphError = false;
      }
      $scope.load = false;
    }).error(function(data) {
      $scope.load = false;
      $scope.graphError = false;
    });
  };

  $scope.checkSob = function () {
    $scope.load = true;
    $scope.graphError = true;
    $http.post('/sob/' + $scope.graph.sobId + '/desc').success(function(data) {
      if(data) {
        $scope.showDetails = false;
      } else {
        $scope.showDetails = true;
        $scope.graphError = false;
      }
      $scope.load = false;
    }).error(function(data) {
      $scope.load = false;
      $scope.graphError = false;
    });
  };


  $scope.$watch('graph', function() {
    $('#graphModal').data('graph', $scope.graph);
  }, true);
});
