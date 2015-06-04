app.controller('clientCtrl', function($scope, $http, $routeParams, $rootScope, SocketIO, $compile, $filter, $timeout, $q, $location) {
  var uname = $routeParams.username,
    sname = $routeParams.slidename;
  $scope.slideShows = [];
  var revealOptions;
  var getViews = function() {
    var deferred = $q.defer();
    $http.get('/api/view/' + uname + '/' + sname).success(function(data) {
      if(!data) {
        $location.path('/');
        deferred.reject();
      }
      $scope.slideshow = data;
      revealOptions = data.reveal;
      revealOptions.multiplex = {
        secret: null,
        id: data.multiplex.id,
        url: ''
      };
      revealOptions.dependencies = [
        { src: '/app/plugin/multiplex/client.js' },
        { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: '/app/plugin/zoom-js/zoom.js', async: true },
        { src: '/app/plugin/math/math.js', async: true },
        { src: '/app/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: '/app/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } }
      ];
      $timeout(function() {
        $('.slides').html(data.slides);
        deferred.resolve(data);
      }, 500);
    });
    return deferred.promise;
  };
  if(uname && sname) {
    getViews().then(function(data) {
      Reveal.initialize(revealOptions);
      Reveal.addEventListener('ready', function(event) {
        if($rootScope.room) SocketIO.emit('leave', $rootScope.room);
        $rootScope.room = data.multiplex.id;
        var ref = '/app/css/' + data.theme.toLowerCase() + '.css';
        if(ref !== $('#theme').attr('href')) {
          $('#theme').attr('href', ref);
        }
        $('#theme').prop('disabled', false);
        SocketIO.emit('join', $rootScope.room);
      });
      $('.slides section').attr('contenteditable', 'false');
    });
    SocketIO.on('slideupdated', function(data) {
      var pos = {
        indexh: Reveal.getIndices().h,
        indexv: Reveal.getIndices().v,
        indexf: Reveal.getIndices().f,
        origin: event.origin
      };
      console.log('updating slideshow...');
      $('.slides section').remove();
      $('.slides').html(data.slides);
      RevealMarkdown.initialize();
      Reveal.slide(pos.indexh, pos.indexv, pos.indexf, 'remote');
      Reveal.configure(data.reveal);
      $compile('.graph')($scope);
        var ref = '/app/css/' + data.theme.toLowerCase() + '.css';
        if(ref !== $('#theme').attr('href')) {
          $('#theme').attr('href', ref);
        }
        $('#theme').prop('disabled', false);
    });
    $scope.$on('$destroy', function(e) {
      Reveal.removeEventListeners();
      SocketIO.destroy();
    });
  } else {
    $('#theme').prop('disabled', true);
    $http.get('/api/view/all').success(function(data) {
      $scope.slideShows = data;
    });

    $timeout(function() {
      $(function() {
        $scope.items = $('#items').masonry({
          // disable initial layout
          isInitLayout: false,
          itemSelector: '.item',
          columnWidth: '.item',
          gutter: 10
        });
        $scope.items.masonry();
      });
    }, 500);
  }
  $scope.searchChange = function() {
    $timeout(function() {
        $scope.items.masonry('reloadItems');
        $scope.items.masonry();
    }, 1000);
  };
  $scope.setSearch = function(e) {
    $scope.search = e;
  };
});

app.controller('masterCtrl', function($scope, $http, $location, $routeParams, $rootScope, SocketIO, $q) {
  var sname = $routeParams.slidename;
  var revealOptions;
  var getSlideshow = function() {
    var deferred = $q.defer();
    $http.get('/api/account/' + sname).success(function(data) {
      if(!data) {
        $location.path('/');
        deferred.reject();
      }
      $scope.slideshow = data;
      revealOptions = data.reveal;
      revealOptions.multiplex = {
        secret: data.multiplex.secret,
        id: data.multiplex.id,
        url: ''
      };
      revealOptions.dependencies = [
        { src: '/app/plugin/multiplex/master.js' },
        { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: '/app/plugin/zoom-js/zoom.js', async: true },
        { src: '/app/plugin/math/math.js', async: true },
        { src: '/app/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: '/app/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } }
      ];
      $('.slides').html(data.slides);
      deferred.resolve(data);
    });
    return deferred.promise;
  };
  getSlideshow().then(function(data) {
    $('.slides section').attr('contenteditable', 'false');
    Reveal.initialize(revealOptions);
    Reveal.addEventListener('ready', function(event) {
      if($rootScope.room) SocketIO.emit('leave', $rootScope.room);
      $rootScope.room = data.multiplex.id;
      SocketIO.emit('join', $rootScope.room);
      var ref = '/app/css/' + data.theme.toLowerCase() + '.css';
      if(ref !== $('#theme').attr('href')) {
        $('#theme').attr('href', ref);
      }
      $('#theme').prop('disabled', false);
    });
    $scope.$on('$destroy', function(e) {
      Reveal.removeEventListeners();
      SocketIO.destroy();
    });
  });
});

app.controller('userCtrl', function($scope, $http, userProfile, SocketIO, $timeout) {
  $scope.slideshow = null;
  $scope.showDetails = true;
  $scope.reportDetails = true;
  $scope.graphError = true;
  $scope.saveEditorError = true;
  $scope.saveEditorSuccess = true;
  $scope.graph = {};
  $scope.username = userProfile.display_name;
  $scope.slideShows = [];
  $('#theme').prop('disabled', true);
  $scope.deleteSlide = function(sname) {
    $http.delete('/api/account/' + sname).success(function(data) {
      if(data && data.success) {
        $scope.slideShows = $.grep($scope.slideShows, function(obj, i) {
          return obj.slideName === sname;
        }, true);
      }
    }).then(function() {
      $timeout(function() {
        $scope.items.masonry();
      }, 500);
    });
  };
  $http.get('/api/account').success(function(data) {
    $scope.slideShows = data;
  });

  $timeout(function() {
    $(function() {
      $scope.items = $('#items').masonry({
        // disable initial layout
        isInitLayout: false,
        itemSelector: '.item',
        columnWidth: '.item',
        gutter: 10
      });
      $scope.items.masonry();
    });
  }, 500);

  $scope.checkSlideShowName = function(a) {
    if(!$scope.slideShows.length) return true;
    return typeof(a) !== 'undefined' && $.grep($scope.slideShows, function(obj, i) {
      return obj.slideName === a;
    }).length === 0;
  };
});

app.controller('editorCtrl', function($scope, $http, $routeParams, $location, SocketIO, userProfile, graphs, $compile, $q, $timeout) {
  $scope.showDetails = true;
  $scope.reportDetails = true;
  $scope.graphError = true;
  $scope.graph = {};
  $scope.transitions = ['Default', 'Slide', 'Convex', 'Concave', 'Zoom'];
  $scope.themes = ['Simple', 'White', 'League', 'Sky', 'Beige', 'Blood', 'Black', 'Moon', 'Night', 'Serif', 'Solarized'];
  $scope.revealOptions = {autoSlide: 0, transition: 'Default', theme: 'Simple'};
  $scope.currentTransition = 'Default';
  $scope.currentTheme = 'Simple';
  $scope.autoSlide = 0;
  $scope.createGraph = function() {
    var str = '<nvd3-' + $scope.graph.graphType
      + ' class="graph" reportId="' + ($scope.graph.reportId || '') + '" '
      + 'sobId="' + ($scope.graph.sobId || '') + '" '
      + 'xValue="' + $scope.graph.xValue +'" '
      + 'yValue="' + $scope.graph.yValue +'" '
      + 'graphType="' + $scope.graph.graphType +'" '
      + 'data="graph[\''+ ($scope.graph.reportId || $scope.graph.sobId || '') + $scope.graph.graphType + $scope.graph.xValue + $scope.graph.yValue +'\']"'
      + 'isArea="true" showXAxis="true" showYAxis="true" interactive="true" showLegend="true" staggerLabels="true" rotateLabels="20"';
    if ($scope.graph.graphType === 'pie-chart' || $scope.graph.graphType === 'scatter-chart'
        || $scope.graph.graphType === 'sparkline-chart' || $scope.graph.graphType === 'line-with-focus-chart') {
      str += ' x="xFunction()" ' + 'y="yFunction()"';
    }
    if ($scope.graph.option && $scope.graph.option.date) str += ' xAxisTickFormat="xAxisTickFormatFunction()"';
    str += ' noData="No Data Found!" height="500"></nvd3-' + $scope.graph.graphType + '><p>&nbsp</p>';
    if ($('.slides .present').hasClass('stack')) {
        $('.slides .present > .present').append(str);
        $compile($('.slides .present > .present .graph'))($scope);
    } else {
      $('.slides .present').append(str);
      $compile($('.slides .present .graph'))($scope);
      console.log($compile($('.slides .present .graph'))($scope))
    }
    var id = $scope.graph.reportId || $scope.graph.sobId,
      x = $scope.graph.xValue,
      y = $scope.graph.yValue,
      graphType = $scope.graph.graphType,
      graphData = id + graphType + x + y,
      rid = $scope.graph.reportId,
      qType = ($scope.graph.reportId ? '/report/' : '/sob/');
    graphs.makeGraph(id, x, y, rid, $scope.slideshow.slideName, $scope.slideshow.username, graphType, qType)
      .then(function(data) {
        console.log(data);
        $scope.graph[graphData] = data;
      });
    $('#graphModal input[type="checkbox"]:checked').removeAttr('checked');
    $('#graphModal select').val(null);
    $('#graphModal').data('graph', '');
    $('#graphModal').modal('hide');
    $('.graph').dblclick(function() {
      $(this).remove();
    });
  };
  $scope.showConfig = function() {
    $('#config').removeClass('ng-hide');
    $('#editor').addClass('ng-hide');
  };
  $scope.goBack = function() {
    $('#editor').removeClass('ng-hide');
    $('#config').addClass('ng-hide');
  };
  var getSlideshow = function() {
    var deferred = $q.defer();
    $http.get('/api/account/' + $routeParams.slidename).success(function(data) {
      $scope.slideshow = data || { slideName: $routeParams.slidename, username: userProfile.username };
      if (data) {
        $scope.currentTransition = data.reveal.transition;
        $scope.currentTheme = data.theme;
        $scope.autoSlide = data.reveal.autoSlide / 1000;
        $('.slides').append(data.slides);
        $('[contenteditable="true"]').each(function() {
          var ck = CKEDITOR.inline(this);
          ck.on('instanceReady', function(ev) {
            var editor = ev.editor;
            editor.setReadOnly(false);
          });
        });
        deferred.resolve();
      } else {
        $('.slides').append('<section class="future inlineEditor" contenteditable="true"><p>New Slide</p></section>');
        var ck = CKEDITOR.inline($('.slides section').get(0));
        ck.on('instanceReady', function(ev) {
          var editor = ev.editor;
          editor.setReadOnly(false);
        });
        deferred.resolve();
      }
    });
    return deferred.promise;
  };
  getSlideshow().then(function() {
    $timeout(function() {
      Reveal.initialize({
        transition: 'convex',
        transitionSpeed: 'slow'
      });
      Reveal.addEventListener('ready', function() {
        $scope.addRightSlide = function() {
          var newSlide = $('<section class="future inlineEditor" contenteditable="true"><p>New Slide</p></section>');
          newSlide.insertAfter('.slides > .present');
          CKEDITOR.inline($(newSlide).get(0));
          Reveal.right();
        };
        $scope.addDownSlide = function() {
          var section = $('.slides > .present');
          if (!section.hasClass('stack')) {
            $('.slides > .present').wrap('<section class="stack present"></section>');
          }
          var newSlide = $('<section class="future inlineEditor" contenteditable="true"><p>New Slide</p></section>');
          newSlide.insertAfter('.slides > .present > .present');
          CKEDITOR.inline($(newSlide).get(0));
          Reveal.down();
        };
        $scope.deleteSlide = function() {
          if (Reveal.getTotalSlides() == 1) {
            alert("Delete slideshow from account page");
            return 0;
          }
          if (Reveal.getIndices().h == 0 && Reveal.getIndices().v == 0) {
            if($('.slides > .present').next().length) {
              Reveal.right();
              $('.slides > .present').prev().remove();
              Reveal.left();
              Reveal.down();
              Reveal.up();
            } else {
              $scope.addRightSlide();
              $('.slides > .present').prev().remove();
              Reveal.left();
              $('.slides > section').addClass('present');
            }
          } else if ($('.slides > .present > .present').index() == 0 || ($('.slides > .present') && Reveal.getIndices().v == 0)) {
            $('.slides > .present').remove();
            Reveal.left();
          } else {
            $('.slides > .present > .present').remove();
            Reveal.up();
          }
        };
      }, 500);
    });
  });
  $scope.updateMarkdown = function() {
    $scope.loading = true;
    var reveal = {
      transition: $($('.slideConfig input[type="radio"]:checked')[0]).val(),
      autoSlide: parseInt($('.input-group #autoslide').val()) * 1000
    };
    var theme = $($('.slideConfig input[type="radio"]:checked')[1]).val();
    $('svg').remove();
    $($('.slides').children()).removeClass('stack past present future');
    var md = $('.slides').html();
    $http.post('/api/account/' + $scope.slideshow.slideName, { slides: md, reveal: reveal, theme: theme }).success(function(data) {
      $scope.loading = false;
      if(data && data.success) {
        SocketIO.emit('slidesaved', data.slideshow);
      }
      $location.path('/');
    }).error(function(data) {
      $scope.loading=false;
    });
  };
  $('#graphModal').off().on('hidden.bs.modal', function() {
    $scope.graph = {};
    $scope.reportType = 'rID';
    $scope.showDetails = true;
    $scope.reportDetails = false;
    $scope.$apply();
  });
  $scope.$watch('graph', function() {
    $('#graphModal').data('graph', $scope.graph);
  }, true);
  $scope.checkReport = function () {
    $scope.load = true;
    $scope.graphError = true;
    $http.post('/force/report/' + $scope.graph.reportId + '/desc', { username: userProfile.username, slidename: $scope.slideshow.slideName }).success(function(data) {
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
    $http.post('/force/sob/' + $scope.graph.sobId + '/desc').success(function(data) {
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
  $scope.showGraphType = function(e) {
    if (e == 'rID') {
      $scope.reportDetails = false;
      $scope.reportTabSelected = false;
    } else {
      $scope.reportDetails = true;
      $scope.reportTabSelected = true;
    }
  };
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
});
