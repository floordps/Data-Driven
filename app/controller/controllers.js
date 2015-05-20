app.controller('clientCtrl', function($scope, $http, $routeParams, $rootScope, SocketIO, $compile) {
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
      var revealOptions = data.reveal;
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
      $('#slideMd').html(data.slides);
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
      $('.slides').prepend($('<section data-markdown="" data-separator="---$"><script id="slideMd"></script></section>'));
      $('#slideMd').html(data.slides);
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
    var revealOptions = data.reveal;
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
    $('#slideMd').html(data.slides);
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

  $('#graphModal').off().on('hidden.bs.modal', function() {
    $scope.graph = {};
    $scope.reportType = 'rID';
    $scope.showDetails = true;
    $scope.reportDetails = false;
    $scope.$apply();
    $scope.reportDetails = false;
    $scope.$apply();
  });
  $scope.$watch('graph', function() {
    $('#graphModal').data('graph', $scope.graph);
  }, true);
});

app.controller('editorCtrl', function($scope, $http, $routeParams, $location, SocketIO) {
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
  Reveal.initialize({
    center: false,
    history: false,
    transition: 'convex',
    transitionSpeed: 'slow'
  });
  Reveal.addEventListener('ready', function() {
    $scope.addRightSlide = function() {
      var newSlide = $('<section class="future inlineEditor" contenteditable="true"><p>New Slide</p></section>');
      newSlide.insertAfter('.slides > .present');
      CKEDITOR.inline($(newSlide).get(0));
      Reveal.right();
    }
    $scope.addDownSlide = function() {
      var section = $('.slides > .present');
      if (!section.hasClass('stack')) {
        //$('.slides > .present').replaceWith('<section class="stack present">' + section.prop('outerHTML') + '</section>');
        $('.slides > .present').wrap('<section class="stack present"></section');
      }
      var newSlide = $('<section class="future inlineEditor" contenteditable="true"><p>New Slide</p></section>');
      newSlide.insertAfter('.slides > .present > .present');
      CKEDITOR.inline($(newSlide).get(0));
      Reveal.down();
    }
    $scope.deleteSlide = function() {
      if (Reveal.getTotalSlides() == 1) {
        alert("Delete slideshow from account page");
        return 0;
      }
      if ($('.slides > .present').hasClass('stack')) {
        var stackPresentSlide = $('.slides > .stack.present > .present');
        if (stackPresentSlide.prev().index() >= 0) {
          stackPresentSlide.remove();
          Reveal.up();
        } else if (stackPresentSlide.next().length) {
          Reveal.down();
          stackPresentSlide.remove();
          Reveal.up();
          Reveal.down();
          Reveal.up();
        } else if (!(stackPresentSlide.next().length && stackPresentSlide.prev().length)) {
          $('.slides > .present').remove();
          Reveal.left();
        }
      } else if ($('.slides > .present')) {
        if ($('.slides > .present').prev().length) {
          $('.slides > .present').remove();
          Reveal.left()
        } else {
          Reveal.right();
          $('.slides > .present').prev().remove();
          Reveal.left();
        }
      }
      // var stack = $('.slides > .stack.present > .present');
      // if (stack.index() == 0) {
      //   stack.remove();
      // }
      // console.log($('.slides > .stack.present > .present').index());


      // if($('.slides > section').length == 1) {
      //   alert("Delete slideshow from account page");
      //   return 0;
      // }
      // if($('.slides > .present').index() != 0 || $('.slides > .present').hasClass('stack')) {
      //   if($('.slides > .present').hasClass('stack')) {
      //     var tmp = $('.slides > .stack.present');
      //     Reveal.right();
      //     tmp.remove();
      //     Reveal.right();
      //     Reveal.left();
      //     // if($('.slides > .stack.present > section').length == 1) {
      //     //   $('.slides > .stack.present').remove();
      //     //   Reveal.right();
      //     //   Reveal.left();
      //     // } else {
      //     //   // $('.slides > .stack.present > .present').remove();
      //     //   // Reveal.down();
      //     //   // Reveal.up();
      //     //   Reveal.getCurrentSlide().remove();
      //     // }
      //   } else {
      //     Reveal.getCurrentSlide().remove();
      //     Reveal.left();
      //   }
      // } else {
      //   Reveal.right();
      //   Reveal.getPreviousSlide().remove();
      //   Reveal.left();
      //   Reveal.right();
      //   Reveal.left();
      // }

      //
      // if($('.slides > .present').hasClass('stack') && !!Reveal.getPreviousSlide() && ($('.slides > section').length == 1)) {
      //   console.log("HERE")
      //   alert("Delete slideshow from account page");
      //   return 0;
      // }
    }
  });
  // $scope.showDetails = true;
  // $scope.reportDetails = true;
  // $scope.graphError = true;
  // $scope.graph = {};
  // $scope.transitions = ['Default', 'Slide', 'Convex', 'Concave', 'Zoom'];
  // $scope.themes = ['Simple', 'White', 'League', 'Sky', 'Beige', 'Blood', 'Black', 'Moon', 'Night', 'Serif', 'Solarized'];
  // $scope.revealOptions = {autoSlide: 0, transition: 'Default', theme: 'Simple'};
  // $scope.currentTransition = 'Default';
  // $scope.currentTheme = 'Simple';
  // $scope.autoSlide = 0;
  // var form = $('#wizard');
  //
  // form.steps({
  //   headerTag: 'h3',
  //   bodyTag: 'div',
  //   transitionEffect: 'slideLeft',
  //   stepsOrientation: 'vertical',
  //   enableAllSteps: true,
  //   enableKeyNavigation: true,
  //   enablePagination: true,
  //   startIndex: 0,
  //   showFinishButtonAlways: true,
  //   autoFocus: true,
  //   onFinished: function(event, currentIndex) {
  //     $scope.updateMarkdown();
  //   }
  // });
  //
  // $scope.goBack = function() {
  //   $('#editor').removeClass('ng-hide');
  //   $('#config').addClass('ng-hide');
  // };
  // $http.get('/api/account/' + $routeParams.slidename).success(function(data) {
  //   var slides = '';
  //   $scope.slideshow = data || { slideName: $routeParams.slidename };
  //   if (data) {
  //     $scope.currentTransition = data.reveal.transition;
  //     $scope.currentTheme = data.theme;
  //     $scope.autoSlide = data.reveal.autoSlide / 1000;
  //     slides = data.slides || '';
  //     }
  //   slides.split('\n---\n').forEach(function(data, index) {
  //     var $textarea = $('<textarea class=".text-editor" name="content" data-provide="markdown" rows="28"></textarea>');
  //     $textarea.text(data);
  //     $('#wizard').steps('add', {
  //       title: '',
  //       content: ''
  //     });
  //     $('#wizard .content #wizard-p-' + index).html($textarea);
  //     markdownEditor();
  //   });
  // });
  // $scope.updateMarkdown = function() {
  //   $scope.loading = true;
  //   var reveal = {
  //     transition: $($('.slideConfig input[type="radio"]:checked')[0]).val(),
  //     autoSlide: parseInt($('.input-group #autoslide').val()) * 1000
  //   };
  //   var theme = $($('.slideConfig input[type="radio"]:checked')[1]).val();
  //   var md = $.map($('#wizard .content textarea'), function(obj) { return $(obj).val(); }).join("\n---\n");
  //   $http.post('/api/account/' + $scope.slideshow.slideName, { slides: md, reveal: reveal, theme: theme }).success(function(data) {
  //     $scope.loading = false;
  //     if(data && data.success) {
  //       SocketIO.emit('slidesaved', data.slideshow);
  //     }
  //     $location.path('/');
  //   }).error(function(data) {
  //     $scope.loading=false;
  //   });
  // };
  // $('#graphModal').off().on('hidden.bs.modal', function() {
  //   $scope.graph = {};
  //   $scope.reportType = 'rID';
  //   $scope.showDetails = true;
  //   $scope.reportDetails = false;
  //   $scope.$apply();
  // });
  // $scope.$watch('graph', function() {
  //   $('#graphModal').data('graph', $scope.graph);
  // }, true);
  // $scope.checkReport = function () {
  //   $scope.load = true;
  //   $scope.graphError = true;
  //   $http.post('/force/report/' + $scope.graph.reportId + '/desc', { username: userProfile.username, slidename: $scope.slideshow.slideName }).success(function(data) {
  //     if(data) {
  //       $scope.labels = [];
  //       data.cols.forEach(function(data) {
  //       $scope.labels.push(data.label);
  //       $scope.showDetails = false;
  //       });
  //     } else {
  //       $scope.showDetails = true;
  //       $scope.graphError = false;
  //     }
  //     $scope.load = false;
  //   }).error(function(data) {
  //     $scope.load = false;
  //     $scope.graphError = false;
  //   });
  // };
  //
  // $scope.checkSob = function () {
  //   $scope.load = true;
  //   $scope.graphError = true;
  //   $http.post('/force/sob/' + $scope.graph.sobId + '/desc').success(function(data) {
  //     if(data) {
  //       $scope.showDetails = false;
  //     } else {
  //       $scope.showDetails = true;
  //       $scope.graphError = false;
  //     }
  //     $scope.load = false;
  //   }).error(function(data) {
  //     $scope.load = false;
  //     $scope.graphError = false;
  //   });
  // };
  // $scope.showGraphType = function(e) {
  //   if (e == 'rID') {
  //     $scope.reportDetails = false;
  //     $scope.reportTabSelected = false;
  //   } else {
  //     $scope.reportDetails = true;
  //     $scope.reportTabSelected = true;
  //   }
  // };
  // $scope.gTypes = [
  //   {name: 'line-chart', type: 'Line Charts'},
  //   {name: 'stacked-area-chart', type: 'Stacked Area Charts'},
  //   {name: 'multi-bar-chart', type: 'Multi Bar Charts'},
  //   {name: 'multi-bar-horizontal-chart', type: 'Multi Bar Horizontal Charts'},
  //   {name: 'discrete-bar-chart', type: 'Discrete Bar Charts'},
  //   {name: 'pie-chart', type: 'Pie Charts'},
  //   {name: 'scatter-chart', type: 'Scatter Charts'},
  //   {name: 'sparkline-chart', type: 'Sparkline  Charts'},
  //   {name: 'cumulative-line-chart', type: 'Cumulative Line Charts'},
  //   {name: 'line-with-focus-chart', type: 'Line with Focus Charts'}
  // ];
});
