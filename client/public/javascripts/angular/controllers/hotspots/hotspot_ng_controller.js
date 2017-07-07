/* eslint-disable */
controllers.controller('hotspotController', function($scope, $http, $window, Utils, placeService) {

  $scope.i = 1; // current_step
  $scope.selectedHotspot;
  $scope.places;
  $scope.loadingPlaces = true;
  $scope.loadPlacesFailed = false;


  // Get all places
  $scope.initializeHotspot = function(hotspot) {
    $scope.selectedHotspot = Utils.parseJson(hotspot);

  };

  function toggleClass(id, className) {
    $(function() {
      $('#' + id.toString()).toggleClass(className);
    });
  }

  function allowedToGoToNextStep() {
    if ($scope.i >= 3) {
      return false;
    }
    if ($scope.i == 1 && !($scope.selectedHotspot.place_id && $scope.selectedHotspot.name)) {
      return false;
    }
    return true
  }

  $scope.nextStep = function() {
    if (allowedToGoToNextStep()) {

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

  $scope.getPlaces = function() {

    placeService.getNames(function(err, places) {
      $scope.loadingPlaces = false;
      if (err) {
        $scope.loadPlacesFailed = true;
        return;
      }
      $scope.places = places;
    })
  }
  $scope.getPlaces()

});
