/* eslint-disable */
controllers.controller('hotspotController', function($scope, $http, $window, Utils) {

  var i = 1; // current_step

  function toggleClass(id, className) {
    $(function() {
      $('#' + id.toString()).toggleClass(className);
    });
  }

  $scope.nextStep = function() {
    if (i < 3) {

      var className = "btn-outline";
      toggleClass(i, className);
      i += 1;
      toggleClass(i, className);
      if (i == 2) {
        toggleClass('previous', 'hidden');
      }
      if (i == 3) {
        toggleClass('next', 'hidden');
      }
    }
  }

  $scope.previousStep = function() {
    if (i > 1) {
      var className = "btn-outline";
      toggleClass(i, className);
      i -= 1;
      toggleClass(i, className);
      if (i == 1) {
        toggleClass('previous', 'hidden');
      }
      if (i == 2) {
        toggleClass('next', 'hidden');
      }
    }
  }

});
