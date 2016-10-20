controllers

    .controller('placeController', function ($scope, $http, $window) {
        $scope.places = {};
        $scope.selectedPlace = null;
        $scope.metrics = {};
        $scope.loadingVisitsByDayChart = true;
        $scope.loadingVisitsByHourChart = true;
        $scope.loadingVisitsByDayAndHourChart = true;


    // Get all places
        $scope.initializePlaces = function (places, selectedPlace) {
            if (places)
                $scope.places = JSON.parse(places);
            if (selectedPlace)
                $scope.selectedPlace = JSON.parse(selectedPlace);
        };

        $scope.initializeMetrics = function (metrics) {
            if (metrics) {
                $scope.metrics = JSON.parse(metrics);
            }
        };


        $scope.getKeys = function (json) {
            return Object.keys(json);
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


    // metrics

        const options = {
            xaxis: {
                mode: 'time',
                minTickSize: [1, 'hour'],
            },
            series: {
                lines: {
                    show: true,
                },
                points: {
                    show: true,
                },
            },
            grid: {
                hoverable: true, // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: '%y respuestas',
                shifts: {
                    x: -60,
                    y: 25,
                },
            },

        };

        $scope.getVisitsByDay = function (place) {
            $http.get('/api/v1/places/' + place.id + '/metrics/visits/daily')
            .success(function (results) {
                const data = results.data;
                $scope.loadingVisitsByDayChart = false;

                const newData = [data[0]];

                for (let i = 1; i < data.length; i++) {
                    const d1 = data[i - 1][0];
                    const d2 = data[i][0];
                    const diff = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
                    const startDate = new Date(data[i - 1][0]);
                    if (diff > 1) {
                        for (let j = 0; j < diff - 1; j++) {
                            const fillDate = new Date(startDate).setDate(startDate.getDate() + (j + 1));
                            newData.push([fillDate, 0]);
                        }
                    }
                    newData.push(data[i]);
                }

                const d = newData;


                $.plot('#visits-by-day-line-chart', [d], options);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        };

        $scope.getVisitsByHour = function (place) {
            $http.get('/api/v1/places/' + place.id + '/metrics/visits/hourly')
            .success(function (results) {
                const d = results.data;
                // get Offset
                const offset = new Date().getTimezoneOffset();
                for (let i = 0; i < d.length; i++) {
                    d[i][0] -= (offset * 60 * 1000);
                }
                $scope.loadingVisitsByHourChart = false;
                $.plot('#visits-by-hour-line-chart', [d], options);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        };
        $scope.getVisitsByDayAndHour = function (place) {
            $http.get('/api/v1/places/' + place.id + '/metrics/visits/dayandhour')
            .success(function (results) {
                const d = results.data;
                // get Offset
                const offset = new Date().getTimezoneOffset();
                for (let i = 0; i < d.length; i++) {
                    d[i].data[0] -= (offset * 60 * 1000);
                }
                $scope.loadingVisitsByDayAndHourChart = false;
                $.plot('#visits-by-day-and-hour-line-chart', d, options);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
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
            .error(function (data) {
            });
        };

        $scope.getTotalEndUsers = function (place) {
            $http.get('/api/v1/places/' + place.id + '/metrics/endusers/count')

        .success(function (results) {
            place.totalEndUsers = results.data;
            console.log(place.totalEndUsers);
        })
            .error(function (data) {
            });
        };
    });
