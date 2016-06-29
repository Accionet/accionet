controllers

    .controller('placeController', function($scope, $http) {

    $scope.places = {};
    $scope.selectedPlace = null;

    // Get all places
    $scope.initializePlaces = function(places, selectedPlace) {
        if (places)
            $scope.places = JSON.parse(places);
        if (selectedPlace)
            $scope.selectedPlace = JSON.parse(selectedPlace);
    };


    // Delete a place
    $scope.toggleIsActive = function(place) {

        $http.put('/places/' + place.id + '/toggleIsActive')
            .success(function(data) {
              locallyUpdatePlace(data.place);
              })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    function locallyUpdatePlace(updated_place) {
      if(selectedPlace && selectedPlace.id == updated_place.id)
        selectedPlace = updated_place();

        for (var place in $scope.places) {
          if (place.id == updated_place.id) {
            place = updated_place;
          }
        }
    }

    // Create a new place
    $scope.createPlace = function(place) {

        if ($scope.validForm()) {
          console.log("crear");
            $http.post('/places/new', $scope.selectedPlace)
                .success(function(data) {
                    $scope.formData = {};
                    $scope.places = data;
                })
                .error(function(error) {
                    console.log('Error: ' + error);
                });
        }
    };

    // updates a place
    $scope.updatePlace = function(place) {

        if ($scope.validForm()) {
          console.log("crear");
            $http.put('/places/' + $scope.selectedPlace.id +  '/edit', $scope.selectedPlace)
                .success(function(data) {
                    place = data.place;
                })
                .error(function(error) {
                    console.log('Error: ' + error);
                });
        }
    };

    $scope.validForm = function() {
      var bo = !($scope.form.$error.required || $scope.form.$error.maxlength || $scope.form.$error.minlength || $scope.form.$error.email || $scope.form.$error.integer);
        console.log(bo);
        return !($scope.form.$error.required || $scope.form.$error.maxlength || $scope.form.$error.minlength || $scope.form.$error.email || $scope.form.$error.integer);
    };


    $scope.setSelectedPlace = function(place) {
        $scope.selectedPlace = place;
    };


});
