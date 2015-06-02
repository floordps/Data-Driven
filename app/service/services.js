app.factory('graphs', function(charts, $q, $http) {
  var makeGraph = function(id, x, y, rid, slideName, userName, graphType, qType) {
    console.log(userName)
    var deferred = $q.defer();
    $http.post('/force' + qType + id,
    { username: userName, slidename: slideName, xColumn: x, yColumn: y }).success(function(data) {
      var row = [], column = [], xPos, yPos;
      if (!!rid) {
        row = data.factMap['T!T'].rows;
        column = data.reportExtendedMetadata.detailColumnInfo;
        Object.keys(column).forEach(function(key, index) {
          if (column[key].label === x) {xPos = index;}
          if (column[key].label === y) {yPos = index;}
        });
      } else {
        row = data.records.map(function(val) {
          var k = Object.keys(val),
            arr = [];
          xPos = 0;
          yPos = 1;
          k.shift();  // rem attr
          k.forEach(function(v) {
            arr.push({
              label: val[v],
              value: val[v]
            });
          });
          return {
            dataCells: arr
          };
        });
      }
      switch(graphType) {
        case 'multi-bar-chart' :
          deferred.resolve(charts.multiBarChart(id, row, xPos, yPos));
          break;
        case 'pie-chart' :
          deferred.resolve(charts.pieChart(id, row, xPos, yPos));
          break;
        case 'line-chart' :
          deferred.resolve(charts.lineChart(id, row, xPos, yPos));
          break;
        case 'scatter-chart' :
          deferred.resolve(charts.scatterChart(id, row, xPos, yPos));
          break;
        case 'discrete-bar-chart' :
          deferred.resolve(charts.discreteBarChart(id, row, xPos, yPos));
          break;
        case 'stacked-area-chart' :
          deferred.resolve(charts.stackedAreaChart(id, row, xPos, yPos));
          break;
        case 'multi-bar-horizontal-chart' :
          deferred.resolve(charts.multiBarHorizontalChart(id, row, xPos, yPos));
          break;
        case 'sparkline-chart' :
          deferred.resolve(charts.sparklineChart(id, row, xPos, yPos));
          break;
        case 'cumulative-line-chart' :
          deferred.resolve(charts.cumulativeLineChart(id, row, xPos, yPos));
          break;
        case 'line-with-focus-chart' :
          deferred.resolve(charts.lineWithFocusChart(id, row, xPos, yPos));
          break;
        default :
          deferred.reject();
          break;
      }
    });
    return deferred.promise;
  };
  return {
    makeGraph: makeGraph
  };
});

app.factory('charts', function() {
  return {
    multiBarChart: function(id, row, xPos, yPos) {
      return [{key: "Report: " + id,
               values: row.map(function(val, i) {
                 return [
                   val.dataCells[xPos].value,
                   val.dataCells[yPos].value
                 ];
               })
             }];
    }, pieChart: function(id, row, xPos, yPos) {
      return row.map(function(val, i) {
        return {key: val.dataCells[xPos].value, y: val.dataCells[yPos].value};
      });
    }, lineChart: function(id, row, xPos, yPos) {
        return [{key: "Report: " + id,
                 values: row.map(function(val, i) {
                   return [
                     val.dataCells[xPos].value,
                     val.dataCells[yPos].value
                   ];
                 })
               }];
    }, scatterChart: function(id, row, xPos, yPos) {
      return [{key: "Report: " + id,
               values: row.map(function(val, i) {
                 return {
                   x: val.dataCells[xPos].value,
                   y: val.dataCells[yPos].value,
                   size: Math.random()
                 };
               })
             }];
    }, discreteBarChart: function(id, row, xPos, yPos) {
      return [{key: "Report: " + id,
               values: row.map(function(val, i) {
                 return [
                   val.dataCells[xPos].value,
                   val.dataCells[yPos].value
                 ];
               })
             }];
    }, stackedAreaChart: function(id, row, xPos, yPos) {
      return [{key: "Report: " + id,
               values: row.map(function(val, i) {
                 return [
                   val.dataCells[xPos].value,
                   val.dataCells[yPos].value
                 ];
               })
             }];
    }, multiBarHorizontalChart: function(id, row, xPos, yPos) {
      return [{key: "Report: " + id,
               values: row.map(function(val, i) {
                 return [
                   val.dataCells[xPos].value,
                   val.dataCells[yPos].value
                 ];
               })
             }];
    }, sparklineChart: function(id, row, xPos, yPos) {
      return row.map(function(val, i) {
                 return [
                   val.dataCells[xPos].value,
                   val.dataCells[yPos].value
                 ];
               });
    }, cumulativeLineChart: function(id, row, xPos, yPos) {
      return [{key: "Report: " + id,
               values: row.map(function(val, i) {
                 return [
                   val.dataCells[xPos].value,
                   val.dataCells[yPos].value
                 ];
               })
             }];
    }, lineWithFocusChart: function(id, row, xPos, yPos) {
      return [{key: "Report: " + id,
               bar: true,
               values: row.map(function(val, i) {
                 return [
                   val.dataCells[xPos].value,
                   val.dataCells[yPos].value
                 ];
               })
             }];
    }
  };
});
app.factory('SocketIO', function($rootScope) {
  var socket = io.connect('');
  return {
    on: function(event, cb) {
      socket.on(event, function(data) {
        $rootScope.$apply(function() {
          cb.apply(socket, [data]);
        });
      });
    },
    emit: function(event, data, cb) {
      socket.emit(event, data, function() {
        $rootScope.$apply(function() {
          var args = arguments;
          cb.apply(socket, args);
        });
      });
    },
    destroy: function() {
      socket.removeAllListeners();
    }
  };
});
