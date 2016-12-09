/* eslint-disable*/
controllers

    .controller('placeIndexController', function ($scope, $http, $window) {
        $scope.places = {};
        $scope.myOrderBy = 'name';

    // Get all places
        $scope.initializePlaces = function (places) {
            if (places) {
                $scope.places = JSON.parse(places);
            }
        };


        $scope.getKeys = function (json) {
            return Object.keys(json);
        };

        $scope.setOrderBy = function (key) {
            if ($scope.myOrderBy === key) {
                $scope.myOrderBy = `-${key}`;
            }
            else {
                $scope.myOrderBy = key;
            }
        };


        $scope.toggleIsActive = function (place) {
            console.log(place);
            $http.put(`/places/${place.id}/toggleIsActive`)
            .success(function (data) {
                place.is_active = data.place.is_active;
                // locallyUpdatePlace(data.place);
            })
            .error(function (data) {});
        };


        function locallyUpdatePlace(updated_place) {
            console.log(updated_place);
            for (let i = 0; i < $scope.places.length; i++) {
                if ($scope.places[i].id === updated_place.id) {
                // $scope.places[i] = updated_place;
                }
            }
            console.log($scope.places);
        }


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
                    console.log(error);
                });
            }
        };


        $scope.getTotalVisits = function (place) {
            $http.get('/api/v1/places/' + place.id + '/metrics/visits/count')

        .success(function (results) {
            place.totalVisits = results.data;
            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            const firstDate = new Date(results.date);
            const secondDate = new Date();


            const diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
            place.totalDays = diffDays;
        })
            .error(function (data) {});
        };

        $scope.getTotalEndUsers = function (place) {
            $http.get('/api/v1/places/' + place.id + '/metrics/endusers/count')

        .success(function (results) {
            place.totalEndUsers = results.data.toString();
        })
            .error(function (data) {});
        };
    });
