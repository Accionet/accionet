// public/javascripts/angular/controllers

controllers

    .controller('dashboardController', ($scope, $http) => {
        $scope.places = {
            loading: true,
            count: undefined,
        };
        $scope.countPlaces = () => {
            $scope.places.loading = true;
            console.log('count');
            $http.get('/places/count')
            .success((data) => {
                console.log('meneeh');
                console.log(data);
                $scope.places.count = data.amount;
                $scope.places.loading = false;
            })
            .error(() => {

            });
        };
    });
