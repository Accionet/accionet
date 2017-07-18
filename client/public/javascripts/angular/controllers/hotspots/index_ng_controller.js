/* eslint-disable*/
controllers

  .controller('hotspotIndexController', function($scope, $http, $window, Utils, visitMetrics) {
  $scope.hotspots = {};
  $scope.myOrderBy = 'name';

  // Get all places
  $scope.initializeHotspots = function(hotspots) {
    if (hotspots) {
      $scope.hotspots = Utils.parseJson(hotspots);
    }
  };


  $scope.getTotalVisits = function(hotspot) {
    console.log('a mandar');
    visitMetrics.totalVisitOf('hotspots', hotspot.id, function(err, results) {
      if (err) {
        return;
      }
      hotspot.totalVisits = results.data;
    });
  };
});
