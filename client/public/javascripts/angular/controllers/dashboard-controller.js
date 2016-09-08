// public/javascripts/angular/controllers

controllers

    .controller('placeController', ($scope, $http) => {
        $scope.countPlaces = () => {
            $http.get('/places/amount')
            .success((data) => {

            })
            .error((error) => {
            });
        };
    });
