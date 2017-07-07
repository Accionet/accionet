/* eslint-disable */
controllers.controller('hotspotController', function($scope, $http, $window, Utils) {

  $scope.i = 1; // current_step
  $scope.selectedHotspot;



  // Get all places
  $scope.initializeHotspot = function(hotspot) {
      $scope.selectedHotspot = Utils.parseJson(hotspot);

  };

  function toggleClass(id, className) {
    $(function() {
      $('#' + id.toString()).toggleClass(className);
    });
  }

  $scope.nextStep = function() {
    if ($scope.i < 3) {

      var className = "btn-outline";
      toggleClass($scope.i, className);
      $scope.i += 1;
      toggleClass($scope.i, className);
      if ($scope.i == 2) {
        toggleClass('previous', 'hidden');
      }
      if ($scope.i == 3) {
        toggleClass('next', 'hidden');
      }
    }
  }

  $scope.previousStep = function() {
    if ($scope.i > 1) {
      var className = "btn-outline";
      toggleClass($scope.i, className);
      $scope.i -= 1;
      toggleClass($scope.i, className);
      if ($scope.i == 1) {
        toggleClass('previous', 'hidden');
      }
      if ($scope.i == 2) {
        toggleClass('next', 'hidden');
      }
    }
  }

});
