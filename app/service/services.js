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
    }
  };
});
