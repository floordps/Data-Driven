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
