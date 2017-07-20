/* eslint-disable*/
controllers

  .controller('hotspotIndexController', function($scope, $http, $window, Utils, visitMetrics) {
  $scope.hotspots = {};
  $scope.myOrderBy = 'name';

  $scope.initializeHotspots = function(hotspots) {
    if (hotspots) {
      $scope.hotspots = Utils.parseJson(hotspots);
    }
  };

  $scope.toggleIsActive = function(hotspot) {
    $http.put(`/hotspots/${hotspot.id}/toggleIsActive`)
      .success(function(data) {
        hotspot.is_active = data.hotspot.is_active;
      })
      .error(function(data) {});
  };


  $scope.getTotalVisits = function(hotspot) {
    visitMetrics.totalVisitOf('hotspots', hotspot.id, function(err, results) {
      if (err) {
        return;
      }
      hotspot.totalVisits = results.data;
    });
  };

  $scope.getTotalEndUsers = function(hotspot) {
    visitMetrics.getTotalEndUsers('hotspots', hotspot.id, function(err, results) {
      if (err) {
        return;
      }
      hotspot.totalEndUsers = results.data.toString();
    });
  };

  $scope.setOrderBy = function(key) {
    if ($scope.myOrderBy === key) {
      $scope.myOrderBy = `-${key}`;
    } else {
      $scope.myOrderBy = key;
    }
  };

});
