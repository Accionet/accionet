controllers

    .controller('placeController', function ($scope, $http, $window) {
        $scope.places = {};
        $scope.selectedPlace = null;

    // Get all places
        $scope.initializePlaces = function (places, selectedPlace) {
            if (places)
                $scope.places = JSON.parse(places);
            if (selectedPlace)
                $scope.selectedPlace = JSON.parse(selectedPlace);
        };


    // Delete a place
        $scope.toggleIsActive = function (place) {
            $http.put('/places/' + place.id + '/toggleIsActive')
            .success(function (data) {
                locallyUpdatePlace(data.place);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        };

        function locallyUpdatePlace(updated_place) {
            if ($scope.selectedPlace && $scope.selectedPlace.id == updated_place.id)
                $scope.selectedPlace = updated_place;
            for (let i = 0; i < $scope.places.length; i++) {
                if ($scope.places[i].id == updated_place.id) {
                    $scope.places[i] = updated_place;
                }
            }
        }

    // Create a new place
        $scope.createPlace = function (place) {
            if ($scope.validForm()) {
                $http.post('/places/new', $scope.selectedPlace)
                .success(function (data) {
                    $scope.formData = {};
                    $scope.places = data;
                    console.log(data);
                    $window.location.href = '/places/' + data.place.id;
                })
                .error(function (error) {
                    console.log('Error: ' + error);
                });
            }
        };

    // updates a place
        $scope.updatePlace = function (place) {
            if ($scope.validForm()) {
                $http.put('/places/' + $scope.selectedPlace.id + '/edit', $scope.selectedPlace)
                .success(function (data) {
                    place = data.place;
                    console.log(place);
                    $window.location.href = '/places/' + place.id;
                })
                .error(function (error) {
                    console.log('Error: ' + error);
                });
            }
        };

        $scope.validForm = function () {
            return !($scope.form.$error.required || $scope.form.$error.maxlength ||
              $scope.form.$error.minlength || $scope.form.$error.email || $scope.form.$error.integer);
        };


        $scope.setSelectedPlace = function (place) {
            $scope.selectedPlace = place;
        };
    });
