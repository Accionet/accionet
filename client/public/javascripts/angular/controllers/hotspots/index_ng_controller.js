/* eslint-disable*/
controllers

    .controller('hotspotIndexController', function ($scope, $http, $window, Utils) {
      $scope.hotspots = {};
      $scope.myOrderBy = 'name';

  // Get all places
      $scope.initializeHotspots = function (hotspots) {
          if (hotspots) {
              $scope.hotspots = Utils.parseJson(hotspots);
          }
          console.log(hotspots);
      };
    });
